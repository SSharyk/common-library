var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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
	Books.find({}, function (err, book) {
		if (err) throw err;
		res.json(book);
	});
})
.post(function(req, res, next) {
	Books.create(req.body, function (err, book) {
		if (err) throw err;		
		var id = book._id;
		res.writeHead(200, {
			'Content‐Type': 'text/plain'
		});
		res.end('Added the book with id: ' + id);
	});
})
.delete(function(req, res, next) {
	Books.remove({}, function (err, resp) {
		if (err) throw err;
		res.json(resp);
	});
});


/* Get specific book */
router.route('/:bookId')
.get(function(req, res, next) {
	Books.findById(req.params.bookId, function (err, book) {
		if (err) throw err;

		Users.findById(book.holderId, function(err, user) {
			if (err) throw err;

			res.json({
				book: book,
				user: user,
			});
		})
	});
})
.put(function(req, res, next){
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
	Books.findByIdAndRemove(req.params.bookId, function (err, resp) { 
		if (err) throw err;
		res.json(resp);
	});
});


/* Work with comments */
router.route('/:bookId/comments')
.get(function(req, res, next) {
	Comments.find({bookId: req.params.bookId}, function(err, comments){
		if (err) throw err;
		res.json(comments);
	});
})
.post(function(req, res, next) {
	Comments.create(req.body, function (err, comment) {
		if (err) throw err;		
		var id = comment._id;
		res.json(comment)
	});
});

module.exports = router;