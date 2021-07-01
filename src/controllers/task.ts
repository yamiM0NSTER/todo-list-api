import { Request, Response, Router } from 'express';
import { prisma } from '../services/prisma';
import { StatusCodes } from 'http-status-codes';
import { AddTaskDto, TASK_STATUS, UpdateTaskDto } from '../types';
import { taskStatuses } from '../services/taskStatuses';
import moment from 'moment';
import { phpApi } from '../services/phpApi';

class TaskController {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.makeRoutes();
  }

  private makeRoutes() {
    this._router.get('/', this.getTasks);
    this._router.get('/:id', this.getTask);
    this._router.post('/', this.addTask);
    this._router.patch('/:id', this.updateTask);
    this._router.delete('/:id', this.deleteTask);
  }

  get router() {
    return this._router;
  }

  public getTasks = async (req: Request, res: Response) => {
    const tasks = await phpApi.getTasks();
    res.json(tasks);
  };

  public getTask = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const task = await phpApi.getTask(id);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Task not found',
      });
    }

    res.json(task);
  };

  public addTask = async (
    req: Request<any, any, AddTaskDto>,
    res: Response
  ) => {
    const { title, notificationText, notificationTime } = req.body;

    if (moment(notificationTime).valueOf() < moment().valueOf()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Task notification cannot be before now',
      });
    }

    const task = await phpApi.addTask({
      title: title,
      notificationText: notificationText,
      notificationTime: notificationTime,
      userId: req.user!.id,
    });

    taskStatuses.setTaskStatus(task!);

    return res.status(StatusCodes.CREATED).json(task);
  };

  public updateTask = async (
    req: Request<{ id: string }, any, UpdateTaskDto>,
    res: Response
  ) => {
    const { id } = req.params;

    const task = await phpApi.getTask(id);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Task not found',
      });
    }

    if (
      task.taskState === TASK_STATUS.SHOWN ||
      task.taskState === TASK_STATUS.DELETED ||
      moment(task.notificationTime).valueOf() < moment().valueOf()
    ) {
      return res.status(StatusCodes.CONFLICT).json({
        statusCode: StatusCodes.CONFLICT,
        message: 'Task can no longer be modified',
      });
    }

    const updatedTask = await phpApi.updateTask(id, req.body);

    taskStatuses.setTaskStatus(updatedTask!);

    return res.status(StatusCodes.CREATED).json(updatedTask);
  };

  public deleteTask = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const task = await phpApi.getTask(id);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Task not found',
      });
    }

    await phpApi.deleteTask(id);

    taskStatuses.setTaskStatus(task, TASK_STATUS.DELETED);

    return res.status(StatusCodes.OK).send();
  };
}

export const taskController = new TaskController();
