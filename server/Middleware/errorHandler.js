// Error Handler is a middleware that catches errors that are thrown in the application
const { constants } = require('../constants');

// next is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware
const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	switch (statusCode) {
		case constants.VALIDATION_ERROR:
			res.json({
				title: 'Validation Failed',
				message: err.message,
				// stackTrace is used to get the stack trace of the error
				// Basically, it is used to get the information about the error like what caused the error, where the error occurred, etc.
				stackTrace: err.stack // gives the complete path that where is the issue
			});

			break;
		case constants.NOT_FOUND:
			res.json({
				title: 'Not Found',
				message: err.message,
				stackTrace: err.stack
			});

		case constants.UNAUTHORIZED:
			res.json({
				title: 'Unauthorized',
				message: err.message,
				stackTrace: err.stack
			});

		case constants.SERVER_ERROR:
			res.json({
				title: 'Server Error',
				message: err.message,
				stackTrace: err.stack
			});
		default:
			console.log('No error, All Good!!');
			break;
	}
};

module.exports = errorHandler;
