var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	userLogin: {
		type: String,
		required: true
	},

	bookId: {
		type: Schema.ObjectId,
		required: true
	},

	text: {
		type: String,
		require: true
	}
}, {
	timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;