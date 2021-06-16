export class AddTaskDto {
  title!: string;
  notificationText!: string;
  notificationTime!: Date;
  userId!: string;
}

export class UpdateTaskDto {
  title?: string;
  notificationText?: string;
  notificationTime?: Date;
  seen?: number;
}

export interface TaskStatusDto {
  guid: string;
  title: string;
  notificationText: string;
  notificationTime: Date;
  assignee: string;
  status: number;
}

export interface TaskNotificationDto {}

export const TASK_STATUS = {
  NEW: 1000,
  SHOWN: 2000,
  DELETED: 3000,
};

export declare namespace Express {
  export interface User {
    displayName: string;
  }
}
