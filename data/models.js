//// --------->  #1
//книга хранит ссылку на первый комментарий и владельца
//каждый комментарий - ссылку на родителя и книгу

// book
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	year: {
		type: Number,
		required: true
	},
	pages: {
		type: Number,
		required: true
	},

	authors: [{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		}
	}],

	holderId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	}
}, {
	timestamps: true
});

// comment
var commentSchema = new Schema({
	parentId: {
		type: Schema.ObjectId,
		required: false,
		//ref: "CommentC"
	},

	bookId: {
		type: Schema.ObjectId,
		required: true,
		ref: "BookC"
	},
	fromUserId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	},

	text: {
		type: String,
		required: true
	}
})

// history
var historySchema = new Schema({
	fromUserId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	},
	toUserId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	},
	timestamp: {
		type: Date,
		required: true,
		default: new Date()
	}
});

// user
var userSchema = new Schema({
	login: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},

	addresses: [{
		town: {
			type: String,
			required: true
		},
		street: {
			type: String,
			required: false
		},
		building: {
			type: Number,
			required: false
		}
	}]
}, {
	timestamps: true
});

// message 
var messageSchema = new Schema({
	fromUserId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	},
	toUserId: {
		type: Schema.ObjectId,
		required: true,
		ref: "UserC"
	},

	text: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var BookC = mongoose.model('BookC', bookSchema);
var CommentC = mongoose.model('CommentC', commentSchema);
var HistoryC = mongoose.model('HistoryC', historySchema);
var UserC = mongoose.model('UserC', userSchema);
var MessageC = mongoose.model('MessageC', messageSchema);
module.exports.UserC = UserC;
module.exports.BookC = BookC;
module.exports.CommentC = CommentC;
module.exports.HistoryC = HistoryC;
module.exports.MessageC = MessageC;