import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import connectRedis from 'connect-redis';

import * as db from './config/db';
import { deserializeUser, googleStrategy, localStrategy, serializeUser } from './config/passport';
import { client as redisClient } from './config/redis';
import { api } from './routers/api';

db.connect();

const app = express();

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

if (process.env.NODE_ENV === 'production') {
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
} else {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
}

passport.use(localStrategy);
passport.use(googleStrategy);
passport.deserializeUser<string, express.Request>(deserializeUser);
passport.serializeUser<string, express.Request>(serializeUser);
app.use(passport.initialize());
app.use(passport.session());

app.all('*', (req, res, next) => {
  res.cookie('csrf-token', req.csrfToken());
  next();
});

app.use('/api', api);
app.get(
  '/login/google',
  passport.authenticate('google', {
    scope: 'openid profile email',
  }),
);
app.get(
  '/login/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
);
app.use(express.static(path.join(__dirname, 'dist')));

export default app;
