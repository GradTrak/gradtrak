const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

const db = require('./config/db');
const { authStrategy, deserializeUser, serializeUser } = require('./config/passport');
const { api } = require('./routers/api');

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

passport.use(authStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.all('*', (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

app.use('/api', api);
app.use(express.static('dist'));
module.exports = app;
