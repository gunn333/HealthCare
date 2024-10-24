// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
// In this code snippet, we are creating a schema for the user model. The schema defines the structure of the document, default values, validators, etc. The schema is then compiled into a model, which is a class that constructs documents. The model is used to create, read, update, and delete documents in the database.

const mongoose = require('mongoose');

// User Schema is using mongoose.Schema to define the structure of the document in which we are storing the user details.
// Basically, it is a blueprint of the document that we are going to store in the database.
// Async handler is used to handle the errors in the async functions. It is a middleware that takes care of the errors in the async functions.
const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			require: [true, 'please add your email-id']
		},
		first_name: {
			type: String,
			require: [true, 'please add your first name']
		},
		last_name: {
			type: String,
			require: [true, 'please add your last name']
		},
		age: {
			type: Number,
			require: [true, 'please add your age']
		},
		blood_group: {
			type: String,
			require: [true, 'please add your blood group']
		},
		gender: {
			type: String,
			require: [true, 'please add your gender']
		},
		phone_number: {
			type: String,
			require: [true, 'please add your phone number']
		},
		password: {
			type: String,
			require: [true, 'please add your password']
		}
	},
	{
		timestamps: true //automatically adds created at and updatedat fields
	}
);

module.exports = mongoose.model('User', userSchema);
