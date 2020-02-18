const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { api } = require('./routers/api');
const db = require('./config/db');

db.connect();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));
module.exports = app;
