// third-part packages
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// constants
let HOST = 'localhost';
let PORT = 4200;

// routes
var index = require('./routes/index');

// high level Express object
var app = express();

// including odules
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// standart error
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// connecting the server
var server = app.listen(PORT, function() {
	var host = HOST;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;