var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Users = require('../data/user');
var Books = require('../data/book');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function(req, res, next) {
	Users.find({}, function (err, usersCollection){
		if (err) throw err;
		Books.find({}, function (err, booksCollection){
			if (err) throw err;

			var resp = {
				books: booksCollection.length,
				users: usersCollection.length
			};
			res.json(resp);
		});
	});
});

module.exports = router;