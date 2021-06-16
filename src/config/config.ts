export const config = {
  express: {
    port: process.env.PORT || 3333,
    sessionSecret: process.env.SESSION_SECRET || 'randomString12345677',
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN || '',
    clientID: process.env.AUTH0_CLIENT_ID || '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    callbackURL: process.env.AUTH0_CALLBACK_URL || '',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
