const mongoose = require('mongoose');
const doctorSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'please add your name']
		},
		speciality: {
			type: String,
			require: [true, 'please add your speciality']
		},
		phoneNumber: {
			type: String,
			require: [true, 'please add your phonenumber']
		},
		expereince: {
			type: String,
			require: [true, 'please add your experience']
		},
		address: {
			type: String,
			require: [true, 'please add your address']
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('doctor', doctorSchema);
