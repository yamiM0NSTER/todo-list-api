import { Request, Response, Router } from 'express';
import { prisma } from '../services/prisma';

class UserController {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.makeRoutes();
  }

  private makeRoutes() {
    this._router.get('/', this.getUsers);
  }

  get router() {
    return this._router;
  }

  public getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({});
    res.json(users);
  };
}

export const userController = new UserController();
