import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import QueryString from 'qs';
import { URL } from 'url';
import { config } from '../config/config';
import { authorized } from '../middlewares/authorized';

class AuthController {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.makeRoutes();
  }

  private makeRoutes() {
    this._router.get('/auth0/callback', this.auth0Callback);
    this._router.get(
      '/login',
      passport.authenticate('auth0', {
        scope: 'openid email profile',
      }),
      this.auth0Login
    );
    this._router.get('/logout', this.auth0Logout);
    this._router.get('/me', authorized, this.getMe);
  }

  get router() {
    return this._router;
  }

  public auth0Callback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate('auth0', (err, user, info) => {
      if (err) {
        return next(err);
      }
      console.log('user');
      console.log(user);
      console.log('info');
      console.log(info);
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }

        // const returnTo = req.session.returnTo;
        // delete req.session.returnTo;
        // res.redirect(returnTo || '/');
        res.redirect(config.frontend.url);
      });
    })(req, res, next);
  };

  public auth0Login = async (req: Request, res: Response) => {
    console.log('req.session');
    console.log(req.session);
    res.redirect('/');
  };

  public auth0Logout = async (req: Request, res: Response) => {
    console.log('req.user');
    console.log(req.user);
    req.logOut();

    const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);

    const searchString = QueryString.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: config.frontend.url,
    });

    logoutURL.search = searchString;

    res.redirect(logoutURL.toString());
  };

  public getMe = async (req: Request, res: Response) => {
    res.json({
      displayName: req.user!.displayName,
    });
  };
}

export const authController = new AuthController();
