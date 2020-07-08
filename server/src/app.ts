import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';

import * as db from './config/db';
import { deserializeUser, googleStrategy, localStrategy, serializeUser } from './config/passport';
import { api } from './routers/api';

db.connect();

const app = express();

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(localStrategy);
passport.use(googleStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.all('*', (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

app.use('/api', api);
app.get(
  '/login/google',
  passport.authenticate('google', {
    callback: '/login/google/callback',
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
