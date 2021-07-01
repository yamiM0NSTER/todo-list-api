import axios, { AxiosInstance } from 'axios';
import { AddTaskDto, TaskWUser, UpdateTaskDto } from '../types';
import { Task, User } from '@prisma/client';
import moment from 'moment';

class PHPApi {
  private _axios: AxiosInstance;

  constructor() {
    this._axios = axios.create({
      baseURL: 'http://localhost:3999',
    });
  }

  public addTask = async (task: { [key: string]: any }) => {
    try {
      const { data } = await this._axios.request<TaskWUser>({
        url: `/tasks`,
        data: {
          ...task,
          notificationTime: moment(task.notificationTime)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss.S'),
        },
        method: 'POST',
      });

      data.notificationTime = moment.utc(data.notificationTime).toDate();
      return data;
    } catch (err) {}
  };

  public deleteTask = async (guid: string) => {
    try {
      await this._axios.request({
        url: `/tasks/${guid}`,
        method: 'DELETE',
      });
    } catch (err) {}
  };

  public updateTask = async (guid: string, task: UpdateTaskDto) => {
    try {
      const { data } = await this._axios.request<TaskWUser>({
        url: `/tasks/${guid}`,
        data: {
          ...task,
          notificationTime: moment(task.notificationTime)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss.S'),
        },
        method: 'PATCH',
      });
      data.notificationTime = moment.utc(data.notificationTime).toDate();
      return data;
    } catch (err) {}
  };

  public getTask = async (guid: string) => {
    try {
      const { data } = await this._axios.request<TaskWUser>({
        url: `/tasks/${guid}`,
        method: 'GET',
      });
      data.notificationTime = moment.utc(data.notificationTime).toDate();
      return data;
    } catch (err) {
      return undefined;
    }
  };

  public getTasks = async () => {
    try {
      const { data } = await this._axios.request<TaskWUser[]>({
        url: `/tasks`,
        method: 'GET',
      });

      for (const task of data) {
        task.notificationTime = moment.utc(task.notificationTime).toDate();
      }
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  public setTaskShown = async (id: number, seen: number) => {
    try {
      await this._axios.request({
        url: `/tasks-set-shown`,
        data: {
          id: id,
          seen: seen,
        },
        method: 'POST',
      });
    } catch (err) {}
  };

  public getIncommingTasks = async () => {
    try {
      const { data } = await this._axios.request<TaskWUser[]>({
        url: `/tasks-get-incomming`,
        method: 'GET',
      });

      console.log(`getIncommingTasks`);
      console.log(data);

      for (const task of data) {
        task.notificationTime = moment.utc(task.notificationTime).toDate();
      }
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  public getUser = async (email: string) => {
    try {
      const { data } = await this._axios.request<User>({
        url: `/users/${encodeURIComponent(email)}`,
        method: 'GET',
      });
      return data;
    } catch (err) {
      return undefined;
    }
  };

  public addUser = async (user: { email: string; displayName: string }) => {
    try {
      const { data } = await this._axios.request<User>({
        url: `/users`,
        data: user,
        method: 'POST',
      });
      return data;
    } catch (err) {}
  };
}

export const phpApi = new PHPApi();
