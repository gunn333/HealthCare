const mongoose = require('mongoose');
const AccountSchema = mongoose.Schema(
	{
		id: {
			type: String,
			required: [true, 'Please add your id']
		},
		name: {
			type: String,
			required: [true, 'Please add your name']
		},
		phoneNumber: {
			type: String,
			required: [true, 'Please add your phone number']
		},
		age: {
			type: String,
			required: [true, 'Please add your age']
		},
		gender: {
			type: String,
			required: [true, 'Please add your gender']
		},
		address: {
			type: String,
			required: [true, 'Please add your address']
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('account', AccountSchema);
