import { httpServer } from './httpServer';
import { Server, Socket } from 'socket.io';
import { TaskNotificationDto, TaskStatusDto } from '../types';
import { taskStatuses } from './taskStatuses';

const TASK_STATUSES_ROOM = 'task-statuses';

const MESSAGES = {
  TASK_STATUSES: 'task-statuses',
  TASK_STATUS: 'task-status',
  TASK_NOTIFY: 'task-notify',
};

class WsServer {
  private _io?: Server;

  constructor() {
    this._io = undefined;
  }

  start() {
    this._io = new Server(httpServer.server, {
      cors: {
        origin: '*',
      },
    });
    this._io.on('connection', this.handleConnect);
    console.log('WebSocket server ready');

    console.log(Object.keys(this._io.sockets.sockets).length);
  }

  private handleConnect = (socket: Socket) => {
    console.log(`Client connected [id=${socket.id}]`);

    socket.join(TASK_STATUSES_ROOM);
    socket.emit(MESSAGES.TASK_STATUSES, taskStatuses.getAllStatuses());

    socket.on('disconnect', () => {
      console.log(`Client gone [id=${socket.id}]`);
    });
  };

  public emitTaskStatus = (taskStatus: TaskStatusDto) => {
    if (!this._io) {
      return;
    }

    console.log(`[WebSocket] sending task status update`);
    this._io.to(TASK_STATUSES_ROOM).emit(MESSAGES.TASK_STATUS, taskStatus);
  };

  public emitTaskNotification = (taskNotification: string) => {
    if (!this._io) {
      return;
    }

    console.log(`[WebSocket] sending task notification`);
    this._io
      .to(TASK_STATUSES_ROOM)
      .emit(MESSAGES.TASK_NOTIFY, taskNotification);
  };

  get connectedUsers() {
    if (!this._io) {
      return 0;
    }

    return this._io.sockets.sockets.size;
  }
}

export const wsServer = new WsServer();
