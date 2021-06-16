import './env';
import { httpServer } from './services/httpServer';
import { taskStatuses } from './services/taskStatuses';
import { wsServer } from './services/wsServer';

const init = async () => {
  await taskStatuses.start();
  await httpServer.start();
  await wsServer.start();
};

init();
