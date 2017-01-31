var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		required: false
	},
	pages: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: false
	},

	// Foreign keys
	holderId: {
		type: Schema.ObjectId,
		required: true
	},

	authorId: {
		type: Schema.ObjectId,
		required: true
	},

	firstCommentId: {
		type: Schema.ObjectId,
		required: true
	},

	//holder: userSchema,
	///author: [authorSchema],
	//comment: commentSchema,

	suggestions: {
		type: Number,
		min: 0,
		default: 0
	}
},
	{
		timestamps: true
});

var Books = mongoose.model('Book', bookSchema);
module.exports = Books;