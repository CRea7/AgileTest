var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const guestsRouter = require('./routes/guests');
const roomsRouter = require('./routes/rooms');
const baseRouter = require('./routes/base');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/guests', guestsRouter.findAll);
app.get('/guests/:id', guestsRouter.findOne);

app.put('/guests/in/:id', guestsRouter.checkGuestIn);
app.put('/guests/out/:id', guestsRouter.checkGuestOut);

app.post('/guests', guestsRouter.addGuest);

app.delete('/guests/:id', guestsRouter.deleteGuest);

//room routes
app.get('/rooms', roomsRouter.findAll);
app.get('/rooms/empty', roomsRouter.findEmptyRooms);
app.get('/rooms/:id', roomsRouter.findOne);

app.delete('/rooms/:id', roomsRouter.deleteRoom);

//base routes
app.put('/rooms/assign/:id', baseRouter.AssignRoom);
app.put('/rooms/checkout/:id', baseRouter.CheckoutRoom);

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
  res.render('error');
});

module.exports = app;
