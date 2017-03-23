var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mapper = require('properties-mapper');

var Books = require('../data/book');
var Users = require('../data/user');
var Comments = require('../data/comment');
var Messages = require('../data/message');

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
	let mappedBook = mapRequestToMongooseSchema(req.body);

	var userLogin = req.headers["login"];
	Users.find({login: userLogin}, function(err, holder) {
		if (err) throw err;
		if (holder == null) throw new Error("User is not found");

		mappedBook["holderId"] = holder[0]._id;

		Books.create(mappedBook, function (err, book) {
			if (err) throw err;		
			
			var id = book._id;
			let bookResultObject = {
				book: book,
				user: holder[0]
			};

			res.json(bookResultObject);
		});
	});
})
.delete(function(req, res, next) {
	Books.remove({}, function (err, resp) {
		if (err) throw err;
		res.json(resp);
	});
});


function mapRequestToMongooseSchema(body) {
	let source = "Title, Description, Authors, Pages, Year";
	let target = "title, description, authors, pages, year";
	let mappedBook = mapper.map(body, source, target, false);

	mappedBook["authors"] = [];
	for (var i=0; i<body.Authors.length; i++) {
		let mappedAuthor = mapper.map(body.Authors[i], "FirstName, LastName", "firstName, lastName", false);
		mappedBook.authors.push(mappedAuthor);
	}

	return mappedBook;
}


/* Get specific book */
router.route('/:bookId')
.get(function(req, res, next) {
	Books.findById(req.params.bookId, function (err, book) {
		if (err) throw err;

		Users.findById(book.holderId, function(err, user) {
			if (err) throw err;

			let messages = [];
			Messages.find({bookId: req.params.bookId, fromUserLogin: user.login}, function(err, mess1){
				if (err) throw err;
				messages = mess1;
				Messages.find({bookId: req.params.bookId, toUserLogin: user.login}, function(err, mess2){
					if (err) throw err;
					for (var i=0; i<mess2.length; i++) {
						messages.push(mess2[i]);
					}
					messages = messages.sort(dateSorting);
					res.json({
						book: book,
						user: user,
						messages: messages
					});
				});
			});
		})
	});
})
.delete(function(req, res, next) {
	Books.findByIdAndRemove(req.params.bookId, function (err, resp) { 
		if (err) throw err;
		res.json(resp);
	});
});


/* Books of specific user */
router.get("/ofUser/:login", function(req, res, next) {
	Users.find({login: req.params.login}, function(err, holder) {
		if (err) throw err;
		if (holder == null) throw new Error("User is not found");

		Books.find({holderId: holder[0]._id}, function (err, books) {
			if (err) throw err;
			res.json(books);
		});
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

/* Work with private messages */
router.route('/:bookId/messages/:login')
.get(function(req, res, next) {
	let messages = [];
	let bookId = req.params.bookId;
	let login = req.params.login;

	Messages.find({bookId: bookId, fromUserLogin: login}, function(err, mess1){
		if (err) throw err;
		messages = mess1;
		Messages.find({bookId: bookId, toUserLogin: login}, function(err, mess2){
			if (err) throw err;

			for (var m in mess2)
				messages.push(m);

			messages = messages.sort(dateSorting);
			res.json(messages);
		});
	});
})
.post(function(req, res, next) {
	Messages.create(req.body, function (err, mess) {
		if (err) throw err;		
		var id = mess._id;
		res.json(mess)
	});
});

function dateSorting(a, b) {
	if (a["createdAt"] > b["createdAt"]) return 1;
	if (a["createdAt"] < b["createdAt"]) return -1;
	return 0;
}

module.exports = router;