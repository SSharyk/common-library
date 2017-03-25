// ------------------------------
// Modules Importing 
// ------------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var package = require('./package.json');

// routes
var index = require('./routes/index');
var books = require('./routes/books');
var users = require('./routes/users');
var stat = require('./routes/stat');
var auth = require('./routes/auth');
var history = require('./routes/history');
var routerC = require('./routes/routerC')


// ------------------------------
// Configuring
// ------------------------------
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: 'something secret'
}));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', index);
app.use('/book/', books);
app.use('/user/', users);
app.use('/stat/', stat);
app.use('/auth/', auth);
app.use('/history/', history);
app.use('/routerC/', routerC);


// catch 404 and forward to home page
app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  res.redirect('/');
});



// ------------------------------
// error handlers
// ------------------------------

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;