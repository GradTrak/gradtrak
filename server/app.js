const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');

const { api } = require('./routers/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
app.use(express.static('dist'));

module.exports = app;
