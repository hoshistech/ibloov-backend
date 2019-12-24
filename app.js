require('module-alias/register');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require("passport");

//env
const dotenv = require('dotenv');
dotenv.config();


//routes
const EventRouter = require("@routes/events.route");
const indexRouter = require('@routes/index');
const UsersRouter = require('@routes/users.route');
const AuthRouter = require('@routes/auth.route');
const WishListRouter = require("@routes/wishlists.route")

//seeders
const eventsSeederRouter = require('@routes/seeders/events.route');
const wishlistSeederRouter = require('@routes/seeders/wishlists.route');

var app = express();

var dbConnect = require( './config/db.config' );
dbConnect.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug') ;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/v1/users', UsersRouter);
app.use('/v1/event', EventRouter);
app.use('/v1/wishlist', WishListRouter);
app.use('/auth', AuthRouter);

//seeders
app.use('/seeders/event', eventsSeederRouter );
app.use('/seeders/wishlist', wishlistSeederRouter );


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
