import { TaskStatusDto } from '../types';
import { prisma } from './prisma';
import { Task, User } from '.prisma/client';
import { TASK_STATUS } from '../types';
import { wsServer } from './wsServer';
import moment from 'moment';
import { phpApi } from './phpApi';

class TaskStatuses {
  private _tasks: { [Key: number]: TaskStatusDto };
  private _tasksTimeouts: { [Key: number]: NodeJS.Timeout };

  constructor() {
    this._tasks = {};
    this._tasksTimeouts = {};
  }

  public start = async () => {
    const tasks = await phpApi.getTasks();

    const curTimestamp = moment().valueOf();

    tasks!.map(async task => {
      if (moment(task.notificationTime).valueOf() <= curTimestamp) {
        this.setTaskStatus(task, TASK_STATUS.SHOWN);
        return;
      }

      this.setTaskStatus(task);
    });

    setInterval(this.updateStatuses, 60 * 1000);
    console.log('TaskStatuses service running');
  };

  public setTaskStatus = (
    task: Task & { User: User },
    status: number = TASK_STATUS.NEW
  ) => {
    this.removeTaskTimeout(task.id);

    if (
      moment(task.notificationTime).valueOf() <
        moment().add(1, 'minute').valueOf() &&
      task.taskState === TASK_STATUS.NEW
    ) {
      this._tasksTimeouts[task.id] = setTimeout(() => {
        this.taskTimeoutJob(task.id);
      }, task.notificationTime.getTime() - new Date().getTime());
    }

    this._tasks[task.id] = {
      guid: task.guid,
      status: status,
      title: task.title,
      notificationText: task.notificationText,
      notificationTime: task.notificationTime,
      assignee: task.User.displayName,
    };

    wsServer.emitTaskStatus(this._tasks[task.id]);

    if (status === TASK_STATUS.DELETED) {
      delete this._tasks[task.id];
      return;
    }
  };

  public getAllStatuses = () => {
    let taskStatuses: TaskStatusDto[] = [];
    for (const id in this._tasks) {
      taskStatuses.push(this._tasks[id]);
    }
    return taskStatuses;
  };

  private removeTaskTimeout = (taskId: number) => {
    if (!this._tasksTimeouts[taskId]) {
      return;
    }

    clearTimeout(this._tasksTimeouts[taskId]);
    delete this._tasksTimeouts[taskId];
  };

  private taskTimeoutJob = async (taskId: number) => {
    this._tasks[taskId].status = TASK_STATUS.SHOWN;
    wsServer.emitTaskNotification(this._tasks[taskId].guid);
    wsServer.emitTaskStatus(this._tasks[taskId]);

    await phpApi.setTaskShown(taskId, wsServer.connectedUsers);
  };

  private updateStatuses = async () => {
    const incommingTasks = await phpApi.getIncommingTasks();

    for (const key in this._tasks) {
      const task = incommingTasks.find(task => task.id === +key);

      if (!task) {
        continue;
      }

      this.removeTaskTimeout(+key);
      this._tasksTimeouts[+key] = setTimeout(() => {
        this.taskTimeoutJob(+key);
      }, task.notificationTime.getTime() - new Date().getTime());
    }
  };
}

export const taskStatuses = new TaskStatuses();
