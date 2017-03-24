var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Users = require('../data/user');

var router = express.Router();
router.use(bodyParser.json());

/// TODO: auth as a middleware

router.route('/')
.get(function(req, res, next) {
	console.log("GET Users");
	Users.find({}, function (err, user) {
		if (err) throw err;
		res.json(user);
	})
});

router.route('/:login')
.get(function(req, res, next){
	Users.find({login: req.params.login}, function(err, user){
		if (err) throw err;
		res.json(user[0]);
	})
});

module.exports = router;