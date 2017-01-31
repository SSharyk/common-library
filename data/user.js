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
	}
},
	{
		timestamps: true
});
var Users = mongoose.model('User', userSchema);
module.exports = Users;