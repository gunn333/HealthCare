// Express
const express = require('express');
// Error handler is basically a middleware that catches errors that are thrown in the application
const errorHandler = require('./Middleware/errorHandler');
const connectDb = require('./Config/dbconnection');
// CORS - Cross Origin Resource Sharing
// It is a security feature implemented in browsers that restricts web pages from making requests to a different domain than the one that served the web page
const cors = require('cors'); // cors for security at server side

// we install dotenv locally because we don't want to expose our credentials to the public
const dotenv = require('dotenv');
// dotenv.config() is used to read the .env file and parse the contents
dotenv.config();

connectDb(); // db connection setup for crud operations
const app = express();

// process.env.PORT is used to get the port number from the environment variable PORT
// If the environment variable PORT is not set, then the port number is set to 5000
// either file is frontend or backend pass all configurations through env file only.
const port = process.env.PORT || 5000;

const path = require('path');
const hbs = require('hbs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Register the partials directory for hbs
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.get('/', (req, res) => {
	res.send('working');
});

// This is a route for the home page
// app.get('/home', (req, res) => {
// 	// let user = User.findOne({id:})
// 	res.render('home', {});
// });

// This is a route for the alluser page
app.get('/allusers', (req, res) => {
	res.render('users', {
		users: [
			{ id: 1, username: 'Gunn', age: 20 },
			{ id: 1, username: 'Shasha', age: 23 }
		]
	});
});

// app.listen() is used to bind and listen the connections on the specified host and port
app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});

app.set('view engine', 'hbs');
