var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	fromUserLogin: {
		type: String,
		required: true
	},

	toUserLogin: {
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

var Messages = mongoose.model('Message', messageSchema);
module.exports = Messages;