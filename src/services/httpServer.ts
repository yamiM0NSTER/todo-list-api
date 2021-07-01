import express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import { config } from '../config/config';
import { authController } from '../controllers/auth';
import cookieParser from 'cookie-parser';
import { taskController } from '../controllers/task';
import expressSession from 'express-session';
import Auth0Strategy from 'passport-auth0';
import passport from 'passport';
import cors from 'cors';
import { userController } from '../controllers/user';
import { prisma } from './prisma';
import { authorized } from '../middlewares/authorized';
import { phpApi } from './phpApi';

class HttpServer {
  private _httpServer?: Server;
  private _app: Express;

  constructor() {
    this._app = express();
    this._httpServer = undefined;
  }

  async start() {
    this.setupMiddlewares();
    this.assignRoutes();

    await new Promise<void>((resolve, reject) => {
      this._httpServer = this._app.listen(config.express.port, () => {
        console.log(`🚀 Server ready at port ${config.express.port}`);
        resolve();
      });
    });
  }

  private assignRoutes = () => {
    this._app.use('/api/tasks', authorized, taskController.router);
    this._app.use('/api/users', userController.router);
    this._app.use('/api/auth', authController.router);
  };

  private setupMiddlewares = () => {
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use(cookieParser());

    const session = {
      secret: config.express.sessionSecret,
      cookie: {},
      resave: false,
      saveUninitialized: false,
    };

    this._app.use(expressSession(session));

    const strategy = new Auth0Strategy(
      {
        ...config.auth0,
      },
      async function (accessToken, refreshToken, extraParams, profile, done) {
        console.log('profile');
        console.log(profile);
        console.log('extraParams');
        console.log(extraParams);
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */

        const user = await phpApi.getUser(profile.emails![0].value);

        if (!user) {
          const newUser = await phpApi.addUser({
            email: profile.emails![0].value,
            displayName: profile.displayName,
          });

          return done(null, newUser);
        }

        return done(null, user);
      }
    );

    passport.use(strategy);
    this._app.use(passport.initialize());
    this._app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user as Express.User);
    });
  };

  get server() {
    return this._httpServer!;
  }
}

export const httpServer = new HttpServer();
