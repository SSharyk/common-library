var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		required: true
	},

	parentId: {
		type: Schema.ObjectId,
		required: false
	}

	text: {
		type: String,
		require: true
	}
}, {
	timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;