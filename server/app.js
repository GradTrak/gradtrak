const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const api = require('./routers/api').api;

app.use('/api', api);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('this is the express app');
});

module.exports = app;
