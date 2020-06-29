const express = require('express');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

const db = require('./config/db');
const { deserializeUser, googleStrategy, localStrategy, serializeUser } = require('./config/passport');
const { api } = require('./routers/api');

const userController = require('./controllers/userController');

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
module.exports = app;
