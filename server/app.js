const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { api } = require('./routers/api');
const db = require('./config/db');
const courseController = require('./controllers/courseController');
const requirementController = require('./controllers/requirementController');
const tagController = require('./controllers/tagController');
const userController = require('./controllers/userController');

db.connect();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));
module.exports = app;
