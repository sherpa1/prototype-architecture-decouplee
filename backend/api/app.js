'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const tagsRouter = require('./routes/tags');
const usersRouter = require('./routes/users');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(timeout('5s'));
app.use(haltOnTimedout);

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/tags', tagsRouter);
app.use('/users', usersRouter);

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({message:err.message});
});

module.exports = app;
