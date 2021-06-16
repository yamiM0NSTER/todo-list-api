import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: 'You are not logged in',
    });
  }
  next();
};
