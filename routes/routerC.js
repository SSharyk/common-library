var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('../bin/config');

var BookC = require('../data/models').BookC;
var UserC = require('../data/models').UserC;
var CommentC = require('../data/models').CommentC;

var router = express.Router();
router.use(bodyParser.json());

var mongodb = require("mongodb");
var mongoserver = new mongodb.Server("localhost", 27017);
var instance = new mongodb.Db("libraryDB", mongoserver);

/// TODO: show return sth like DalOperationStatus<T>
/// TODO: thus, need find out if JS supports generics (or just use Object)

router.route('/alldb')
.get(function(req, res, next) {
	instance.open(function(err, db) {
		var allBooks = [];

		db.collection('bookcs', function(err, collection){
	    	collection.find().toArray(function(err, books) {
	    		books.forEach(function(bookItem, i, arr) {

					db.collection('usercs', function(err, collection) {
				    	collection
				    	.find( { _id: bookItem.holderId } )
				    	.toArray(function(err, docs) {

							db.collection('commentcs', function(err, commCol) {
						    	commCol
						    	.find( { bookId: bookItem._id } )
						    	.toArray(function(err, commIt) {
						    		var newItem = {
									  	book: bookItem,
									  	user: docs[0],
									  	comments: commIt
									};
									allBooks.push(newItem);
									if (i==arr.length-1){
										res.json({status: "getted"});
									  	console.log(allBooks);
									}
								});
						    });
						});
					});
				});
	    	});
		});
	});
});

router.route('/seed')
.get(function(req, res, next){
	// seed the DB
	createUsers(function(){
		createBooks(function(){
			createComments(function(){
				console.log("Seeder executed successfully");
				res.json({status: "OK"});
			});
		});
	});
});



/* ----- populate the db with fakes -------*/
var usersId = [];
var booksId = [];

function createUsers(next){
	console.log("... creating users ...");

	var user1 = {
		login: "fakeUser1",
		email: "fake1@fake.fk",
		password: "0123456789ABCDEFFEDCBA9876543210",
		addresses: [
		{
			town: "fakeTown",
			street: "fakeStreet"
		},
		{
			town: "No name town"
		}]
	};

	var user2 = {
		login: "fakeUser2",
		email: "fake2@fake.fk",
		password: "0123456789ABCDEFFEDCBA9876543210",
		addresses: [
		{
			town: "fakeTown",
			street: "fakeStreet"
		}]
	};

	UserC.remove({}, function(err){
		if (err) console.error(err);
		else console.log("deleted!");
	});

	UserC.create(user1, function(err, u1){
		if (err) throw err;

		usersId.push(u1._id);		
		UserC.create(user2, function(err, u2){
			if (err) throw err;

			usersId.push(u2._id);
			if (next) next();
		});
	});
}

function createBooks(next){
	console.log("... creating books ...");

	var book1 = {
		title: "War and peace I",
		description: "The fisrt part of the great novel",
		pages: 329,
		year: 1988,
		authors: [{
			firstName: 'Lev',
			lastName: 'Tolstoy'
		}],
		holderId: usersId[0]
	};

	var book2 = {
		title: "War and peace II",
		description: "The ++second++ part of the great novel",
		pages: 405,
		year: 1988,
		authors: [{
			firstName: 'Lev',
			lastName: 'Tolstoy'
		}],
		holderId: usersId[0]
	};

	var book3 = {
		title: "War and peace II",
		description: "The ++second++ part of the great novel",
		pages: 405,
		year: 1988,
		authors: [{
			firstName: 'Lev',
			lastName: 'Tolstoy'
		}],
		holderId: usersId[1]
	};

	BookC.remove({}, function(err){
		if (err) console.error(err);
		else console.log("deleted!");
	});

	BookC.create(book1, function(err, b1){
		if (err) throw err;

		booksId.push(b1._id);
		BookC.create(book2, function(err, b2){
			if (err) throw err;

			booksId.push(b2._id);
			BookC.create(book3, function(err, b3){
				if (err) throw err;

				booksId.push(b3._id);
				if (next) next();
			});
		});
	});
}

function createComments(next){
	console.log("... creating comments ...");

	CommentC.remove({}, function(err){
		if (err) console.error(err);
		else console.log("deleted!");
	});

	var comment1 = {
		bookId: booksId[0],
		fromUserId: usersId[0],
		text: `The book ${booksId[0]} was created by user ${usersId[0]} at ${new Date()}`
	};

	CommentC.create(comment1, function(err, c1){
		if (err) throw err;

		var comment21 = {
			parentId: c1._id,
			bookId: booksId[0],
			fromUserId: usersId[0],
			text: `I have read this book. It is the deepest thing I have ever seen!`
		};

		var comment22 = {
			parentId: c1._id,
			bookId: booksId[0],
			fromUserId: usersId[1],
			text: `Very interesting!`
		};

		CommentC.create(comment21, function(err, c21){
			if (err) throw err;

			var comment3 = {
				parentId: c21._id,
				bookId: booksId[0],
				fromUserId: usersId[1],
				text: `Agree`
			};

			CommentC.create(comment3, function(err, c3){
				if (err) throw err;
			});

			CommentC.create(comment22, function(err, c22){
				if (err) throw err;
			});
		});
	});
}


// /* GET home page. */
// router.route('/')
// .get(function(req, res, next) {
// 	console.log("GET Book");
// 	Books.find({}, function (err, book) {
// 		if (err) throw err;
// 		console.log(book);
// 		res.json(book);
// 	});
// })
// .post(function(req, res, next) {
// 	console.log("POST Book");
// 	console.log(req.body);

// 	/// TODO: add first comment firstly
// 	Books.create(req.body, function (err, book) {
// 		if (err) throw err;		
// 		console.log('Book created successfully!');
// 		var id = book._id;

// 		/// TODO: with population
// 		var userUrl = config.HOST + ":" + config.PORT + "/routerC/users/" + book.holderId;
// 		console.log(userUrl);
// 		var firstComment = {
// 			parentId: null,
// 			bookId: id,
// 			text: "This book is suggested by <a href='" + userUrl + "'> .... login here .... </a>" /////// user login
// 		};
// 		Comments.create(firstComment, function(err, comm) {
// 			res.writeHead(200, {
// 				'Content‐Type': 'text/plain'
// 			});
// 			res.end('Added the book with id: ' + id);
// 		})
// 	});
// })
// .delete(function(req, res, next) {
// 	console.log("DELETE Books");
// 	Books.remove({}, function (err, resp) {
// 		if (err) throw err;
// 		res.json(resp);
// 	});
// });


// /* Get specific book */
// router.route('/:bookId')
// .get(function(req, res, next) {
// 	var bookId = req.params.bookId;
// 	console.log("GET Book # " + bookId);
// 	Books.findById(bookId, function (err, book) {
// 		if (err) throw err;

// 		Users.findById(book.holderId, function(err, user) {
// 			if (err) throw err;

// //// TODO: in ""?
// 			Comments.find({bookId: bookId}, function(err, comments) {
// 				if (err) throw err;

// //// here: deleted authorId, etc
// //// added comments
// 				res.json({
// 					book: book,
// 					user: user,
// 					comments: comments
// 				});
// 			});			// ;???
// 		});				// ;???
// 	});
// })
// .put(function(req, res, next){
// 	console.log("PUT Book # ${req.params.bookId}");
// 	Books.findByIdAndUpdate(req.params.dishId, {
// 		$set: req.body
// 	}, {
// 		new: true
// 	}, function (err, book) {
// 		if (err) throw err;
// 		res.json(book);
// 	});
// })
// .delete(function(req, res, next) {
// 	console.log("DELETE Book # " + req.params.bookId);
// 	Books.findByIdAndRemove(req.params.bookId, function (err, resp) { 
// 		if (err) throw err;
// 		res.json(resp);
// 	});
// });

module.exports = router;