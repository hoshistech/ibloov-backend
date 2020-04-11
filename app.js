require('module-alias/register');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//session
const session = require('express-session');

//passport 
var passport = require("passport");

//body-parser
var bodyParser = require('body-parser');

//env
const dotenv = require('dotenv');
dotenv.config();

//routes
const EventRouter = require("@routes/event.route");
const indexRouter = require('@routes/index');
const UsersRouter = require('@routes/user.route');
const AuthRouter = require('@routes/auth.route');
const WishListRouter = require("@routes/wishlist.route");
const CrowdFundingRouter = require("@routes/crowdfunding.route");
const PaymentRouter = require("@routes/payment.route");
const InfluencerRouter = require("@routes/influencer.route");
const ShoppingRouter = require("@routes/shopping.route");
const CategoryRouter = require("@routes/category.route");
const StoageRouter  = require("@routes/storage.route");

//seeders
const eventSeederRouter = require('@routes/seeders/event.route');
const wishlistSeederRouter = require('@routes/seeders/wishlist.route');
const crowdfundingSeederRouter = require('@routes/seeders/crowdfunding.route');
const userSeederRouter = require('@routes/seeders/user.route');
const influencerSeederRouter = require('@routes/seeders/influencer.route');

var app = express();

var dbConnect = require('./db.connect');
dbConnect.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({

  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

require('@services/auth/localAuth.service')(passport);
require('@services/auth/facebookAuth.service')(passport);
require('@services/auth/googleAuth.service')(passport);


// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

app.use(bodyParser.urlencoded({
  limit: '50md',
  extended: true,
  parameterLimit: 50000
}))

app.use('/', indexRouter);
app.use('/v1/user', UsersRouter);
app.use('/v1/event', EventRouter);
app.use('/v1/wishlist', WishListRouter);
app.use('/v1/crowdfunding', CrowdFundingRouter);
app.use('/v1/payment', PaymentRouter);
app.use('/auth', AuthRouter);
app.use('/v1/influencer', InfluencerRouter);
app.use('/v1/shopping', ShoppingRouter);
app.use('/v1/category', CategoryRouter);
app.use('/v1/do/', StoageRouter);

//seeders
app.use('/seeders/event', eventSeederRouter);
app.use('/seeders/wishlist', wishlistSeederRouter);
app.use('/seeders/crowdfunding', crowdfundingSeederRouter);
app.use('/seeders/user', userSeederRouter);
app.use('/seeders/influencer', influencerSeederRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;