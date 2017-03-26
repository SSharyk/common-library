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

	authors: [{
		firstName: {
			type: String,
			required: true,
		},

		lastName: {
			type: String,
			required: true
		}
	}],

	// Foreign keys
	holderId: {
		type: Schema.ObjectId,
		required: true
	},

	comments: [{ type : Schema.ObjectId, ref: 'Comment' }],
},
	{
		timestamps: true
});

var Books = mongoose.model('Book', bookSchema);
module.exports = Books;