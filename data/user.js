var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	login: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true
	},

	address: {
		town: {
			type: String,
			required: true
		},
		street: {
			type: String,
			required: false
		},
		house: {
			type: String,
			required: false
		}
	},

	books: [{ type : Schema.ObjectId, ref: 'Book' }]
},
	{
		timestamps: true
});
var Users = mongoose.model('User', userSchema);
module.exports = Users;