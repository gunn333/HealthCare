// For MongoDB connection we need to install mongoose package.
// mongoose is used to connect the node.js server with MongoDB database.
const mongoose = require('mongoose');

// async-await is used to handle the asynchronous code.
// async-await basically waits for the promise to resolve. like in this case it waits for the connection to establish.
// if the connection is successful then it will log the message "MongoDB connected: ${con.connection.host}".
// try and catch block is used to handle the error. if the connection is not successful then it will log the error message.

const connectDb = async () => {
	try {
		const connect = await mongoose.connect(process.env.CONNECTION_STRING);
		console.log(
			'Database connected successfully',
			connect.connection,
			connect.connection.name
		);
	} catch (error) {
		console.log('Database connection failed', error);
		process.exit(1);
	}
};

// Exporting the connectDb function so that it can be used in other files.
module.exports = connectDb;
