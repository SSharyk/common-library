var mongoose = require('mongoose');
var Books = require('./book');
var Schema = mongoose.Schema;

var historySchema = new Schema({
	bookId: {
		type: Schema.ObjectId,
		required: true
	},
	
	fromUserLogin: {
		type: String,
		required: true
	},
	toUserLogin: {
		type: String,
		required: true
	},

	status: {
		type: Number,
		required: true
	}
}, 	{
	timestamps: true
});

var History = mongoose.model('History', historySchema);
module.exports = History;

module.exports.STATUS_PROCCESS = 1;
module.exports.STATUS_FINISH = 2;