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

router.route('/:userId')
.get(function(req, res, next){
	console.log("GET user with id = ${req.params.userId}");
	Users.findById(req.params.userId, function(err, user){
		if (err) throw err;
		res.json(user);
	})
});

module.exports = router;