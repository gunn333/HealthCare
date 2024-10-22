// Express
const express = require('express');
// Error handler is basically a middleware that catches errors that are thrown in the application
const errorHandler = require('./Middleware/errorHandler');
const connectDb = require('./config/dbConnection');
// CORS - Cross Origin Resource Sharing
// It is a security feature implemented in browsers that restricts web pages from making requests to a different domain than the one that served the web page
const cors = require('cors'); // cors for security at server side

connectDb(); // db connection setup for crud operations
const app = express();

// process.env.PORT is used to get the port number from the environment variable PORT
// If the environment variable PORT is not set, then the port number is set to 5000
// either file is frontend or backend pass all configurations through env file only.
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(errorHandler);

app.get('/', (req, res) => {
	res.send('working');
});

// app.listen() is used to bind and listen the connections on the specified host and port
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
