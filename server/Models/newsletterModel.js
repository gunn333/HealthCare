const mongoose = require('mongoose');
const newsLetterSchema = mongoose.Schema(
	{
		title: {
			type: String,
			require: [true, 'please add your title']
		},
		author: {
			type: String,
			require: [true, 'please add your first author']
		},
		date: {
			type: String,
			require: [true, 'please add your last date']
		},

		imageURL: {
			type: String,
			require: [true, 'please add your ig']
		},
		description: {
			type: String,
			require: [true, 'please add your des']
		}
	},
	{
		timestamps: true //automatically adds created at and updatedat fields
	}
);
module.exports = mongoose.model('Newletter', newsLetterSchema);
