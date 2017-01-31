var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},

	lastName: {
		type: String,
		required: true
	}
},
	{
		timestamps: true
});

var Authors = mongoose.model('Author', authorSchema);
module.exports = Authors;