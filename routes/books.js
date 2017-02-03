var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Authors = require('../data/author');
var Books = require('../data/book');
var Users = require('../data/user');
var Comments = require('../data/comment');

var router = express.Router();
router.use(bodyParser.json());

/// TODO: show return sth like DalOperationStatus<T>
/// TODO: thus, need find out if JS supports generics (or just use Object)

/* GET home page. */
router.route('/')
.get(function(req, res, next) {
	console.log("GET Book");
	Books.find({}, function (err, book) {
		if (err) throw err;
		console.log(book);
		res.json(book);
	});
})
.post(function(req, res, next) {
	console.log("POST Book");
	console.log(req.body);
	/// TODO: add first comment firstly
	Books.create(req.body, function (err, book) {
		if (err) throw err;		
		console.log('Book created successfully!');
		var id = book._id;
		res.writeHead(200, {
			'Content‐Type': 'text/plain'
		});
		res.end('Added the book with id: ' + id);
	});
})
.delete(function(req, res, next) {
	console.log("DELETE Books");
	Books.remove({}, function (err, resp) {
		if (err) throw err;
		res.json(resp);
	});
});


/* Get specific book */
router.route('/:bookId')
.get(function(req, res, next) {
	console.log("GET Book # " + req.params.bookId);
	Books.findById(req.params.bookId, function (err, book) {
		if (err) throw err;

		Users.findById(book.holderId, function(err, user) {
			if (err) throw err;

			Authors.findById(book.authorId, function(err, auth){
				if (err) throw err;

				res.json({
					book: book,
					user: user,
					author: auth
				});
			})
		})
	});
})
.put(function(req, res, next){
	console.log("PUT Book # ${req.params.bookId}");
	Books.findByIdAndUpdate(req.params.dishId, {
		$set: req.body
	}, {
		new: true
	}, function (err, book) {
		if (err) throw err;
		res.json(dish);
	});
})
.delete(function(req, res, next) {
	console.log("DELETE Book # " + req.params.bookId);
	Books.findByIdAndRemove(req.params.bookId, function (err, resp) { 
		if (err) throw err;
		res.json(resp);
	});
});

module.exports = router;