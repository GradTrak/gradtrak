const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const { api } = require('./routers/api');
const { authStrategy, deserializeUser, serializeUser } = require('./libs/passport');

mongoose.connect('mongodb://localhost/gradtrak', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(authStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use('/api', api);
app.use(express.static('dist'));

module.exports = app;
