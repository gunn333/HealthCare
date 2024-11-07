// Express
// const express = require('express');
// Error handler is basically a middleware that catches errors that are thrown in the application
// const errorHandler = require('./Middleware/errorHandler');
// const connectDb = require('./Config/dbconnection');
// CORS - Cross Origin Resource Sharing
// It is a security feature implemented in browsers that restricts web pages from making requests to a different domain than the one that served the web page
// const cors = require('cors'); // cors for security at server side

// we install dotenv locally because we don't want to expose our credentials to the public
// const dotenv = require('dotenv');
// dotenv.config() is used to read the .env file and parse the contents
// dotenv.config();

// connectDb(); // db connection setup for crud operations
// const app = express();

// process.env.PORT is used to get the port number from the environment variable PORT
// If the environment variable PORT is not set, then the port number is set to 5000
// either file is frontend or backend pass all configurations through env file only.
// const port = process.env.PORT || 5000;

// const path = require('path');
// var hbs = require('hbs');

// Register the partials directory for hbs
// hbs.registerPartials(__dirname + '/views/partials', function (err) {});
// app.set('view engine', 'hbs');

// app.use(express.json());
// app.use(cors());
// app.use(errorHandler);

// app.get('/', (req, res) => {
// 	res.send('working');
// });

// This is a route for the home page
// app.get('/home', (req, res) => {
// let user = User.findOne({id:})
// 	res.render('home', {
// 		username: "Gunn",
// 		posts: "blah blah blah"
// 	});
// });

// This is a route for the alluser page
// app.get('/allusers', (req, res) => {
// 	res.render('users', {
// 		users: [
// 			{ id: 1, username: 'Gunn', age: 20 },
// 			{ id: 1, username: 'Shasha', age: 23 }
// 		]
// 	});
// });

// app.use('/api/', require('./Routes/userRoutes'));
// app.use('/api/details', require('./Routes/doctorDetails'));

// app.listen() is used to bind and listen the connections on the specified host and port
// app.listen(port, () => {
// 	console.log(`Server is running on port http://localhost:${port}`);
// });

// Which routes need to be secure and which routes need to be not secure and why
// The routes that need to be secure are the routes that are used to access the sensitive data of the user
// For example, the routes that are used to access the user's personal information, the routes that are used to access the user's financial information, etc.
// These routes need to be secure because if these routes are not secure, then the sensitive data of the user can be accessed by unauthorized users
// The routes that need to be not secure are the routes that are used to access the public data of the user
// For example, the routes that are used to access the user's public profile, the routes that are used to access the user's public posts, etc.

// What is the difference between HTTP and HTTPS

// HTTP stands for Hypertext Transfer Protocol
// HTTPS stands for Hypertext Transfer Protocol Secure
// HTTP is used to transfer data between the client and the server while HTTPS is used to transfer data between the client and the server securely

const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./Middleware/errorHandler');
const connectDb = require('./Config/dbconnection');
const cors = require('cors'); // CORS for security at server side
const multer = require('multer');
const File = require('./Models/file');
const dotenv = require('dotenv');
// path is basically a module that provides utilities for working with file and directory paths
const path = require('path');
const hbs = require('hbs');
// node.js module used for iteracting with the file system
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDb();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 5000; // Set server port

// Set view engine and views path
// Partials are reusable templates that can be included in other templates
// Register the partials directory for hbs
hbs.registerPartials(path.join(__dirname, 'views', 'partials'), err => {
	if (err) console.error('Error registering hbs partials:', err);
});
// Set the view engine to handlebars
// When you use res.render() to render a view in a route, Express will look for .hbs files in the views folder by default.
app.set('view engine', 'hbs');
// Sets the directory where your view templates are stored
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
// app.use() is used to bind application-level middleware to an instance of the app object
// app.use(express.json()); means that the app will use the json parser middleware which basically parses the incoming request with JSON payloads
app.use(express.json());
// Middleware for parsing URL-encoded data (like form submissions). Extended : true in simple terms means that the data can be of any type.
app.use(express.urlencoded({ extended: true }));
// Middleware for handling CORS (Cross-Origin Resource Sharing) requests
// CORS is a security feature implemented in browsers that restricts web pages from making requests to a different domain than the one that served the web page
app.use(cors());

// Ensure 'uploads' directory exists or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
	console.log("Created 'uploads' directory.");
}

//* File Upload

// Multer is a node.js middleware for handling multipart/form-data which is primarily used for uploading files.
// multipart/form-data means that the form data is encoded as a multipart MIME message
// Multer provides a storage engine to store uploaded files
const storage = multer.diskStorage({
	// destination -> Specifies where the uploaded files should be stored (uploadDir).
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	// filename -> Specifies the name of the uploaded files
	// It creates a unique filename for each uploaded file by appending the current timestamp and a random number to the original filename
	filename: function (req, file, cb) {
		// uniqueSuffix is a unique string that is generated by concatenating the current timestamp and a random number
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		// cb is a callback function that is called after the filename is generated
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${path.extname(
				file.originalname
			)}`
		);
	}
});
// The app will use the storage engine to store the uploaded files
const upload = multer({ storage: storage });

// Route to render the home page with uploaded files data
app.get('/home', async (req, res) => {
	try {
		const files = await File.find(); // Fetch all uploaded files from MongoDB
		res.render('home', {
			username: 'Hiya',
			users: [
				{ name: 'John Doe', age: 30 },
				{ name: 'Jane Smith', age: 25 }
			],
			files: files // Pass files to the template
		});
	} catch (error) {
		console.error('Error rendering home page:', error);
		res.status(500).send('Error loading home page.');
	}
});

// Route to handle file upload and save metadata to MongoDB
app.post('/profile', upload.single('avatar'), async (req, res) => {
	console.log('Upload endpoint hit'); // Log to verify route access

	if (!req.file) {
		console.error('No file uploaded');
		return res.status(400).send('No file uploaded.');
	}

	try {
		// Create a new file record in MongoDB with file metadata
		const fileData = new File({
			originalName: req.file.originalname,
			filename: req.file.filename,
			path: req.file.path,
			size: req.file.size,
			contentType: req.file.mimetype // Store MIME type to handle different file types
		});

		await fileData.save(); // Save metadata to MongoDB
		console.log('File metadata saved:', fileData);
		return res.redirect('/home');
	} catch (error) {
		console.error('Error uploading file:', error);
		res.status(500).send('Error uploading file.');
	}
});

// Route to serve uploaded files directly
app.get('/uploads/:filename', (req, res) => {
	const filePath = path.join(uploadDir, req.params.filename);
	fs.stat(filePath, (err, stat) => {
		if (err) {
			console.error('File not found:', err);
			return res.status(404).send('File not found.');
		}
		res.sendFile(filePath); // Serve the file for download or preview
	});
});

// Import and use additional routes
app.use('/api/', require('./Routes/userRoutes'));
app.use('/api/details', require('./Routes/doctorDetails'));

// Error handling middleware
app.use(errorHandler);

// Start the server and listen for connections
app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});

// Catch any unhandled exceptions for better debugging
process.on('uncaughtException', err => {
	console.error('Uncaught Exception:', err);
});

//* JWT

// Jwt is a token that is used to authenticate users on the web
// Client sends a request with his headers and the server sends a response back with a jwt token
// The server verifies the jwt token and sends a response back to the client
// Client will store the token in the local storage
// How to store in local storage : localStorage.setItem('token', tokenvalue)
// Aise hi hum session cookies mein bhi store kar sakte hain
// How to store in session cookies : res.cookie('token', tokenvalue, {httpOnly: true})
// Difference between Authentication and Authorization
// Authentication is the process of verifying the identity of a user
// Authorization is the process of determining what a user is allowed to do after they have been authenticated (e.g. access a resource, perform an action)
// For example, when a user logs in to a website, they are authenticated by providing their username and password (authentication)
// Once the user is authenticated, the website determines what the user is allowed to do based on their role or permissions (authorization)
// RBAC : Role Based Access Control
// RBAC is a method of restricting access to resources based on the roles of users
// For Login, Request will be sent to the server with the username and password
// Server will check the username and password in the database and if it is correct, it will generate a jwt token and send it back to the client
// Stateful vs Stateless Authentication
// Stateful Authentication : The server maintains the state of the user's session on the server
// For example, when you log into a website, the server keeps track of your login session and other actions (like items in your cart).
// Stateless Authentication : The server does not maintain the state of the user's session on the server
// Stateless mein DB mein data store nahin hota, stateful mein store hota hai
// Stateful is better for user-specific applications, where sessions and user state need to be tracked across interactions for a personalized or complex user experience.
// Stateless is generally more suitable for large-scale applications, APIs, microservices, and systems that require high availability and scalability.
// Stateful: In a stateful system, data can be stored either on the server or client-side, but the key point is that the server keeps track of the user's state. This means the server stores session data (e.g., login information, shopping cart contents) so that it can remember previous interactions during the user's session.
// Stateless: In a stateless system, the server does not store any state information. Each request sent by the client is independent, meaning all the data needed for processing the request is sent along with the request (usually in the form of tokens or parameters), and the server does not "remember" anything from previous requests.
// Structure of JWT Token : JWT tokens are composed of three parts: a header, a payload, and a signature.
// The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.
// The payload contains the claims, which are statements about an entity (typically, the user) and additional data. basically payload is the data that is stored in the token like user id, username, etc.
// The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.
// Jwt has two methods : sign and verify
// Sign has three parameters : payload, secretkey, and options
// Verify has three parameters : token, secretkey, and callback function
// options mein kya jaega : agar hum koi token create kr re hai toh uski expiry date kis time tak ki hai, uska algorithm kya hai, etc.
// To get the secret key from env file : process.env.SECRET_KEY
// payload mein data jaega user ka and if error hai toh console.log(err.message) else console.log(success)
// Sign is used to generate a jwt token and verify is used to verify the jwt token that is generated by the sign method
// Sign : jwt.sign({payload}, secretkey, {expiresIn: '1h'})
// Verify : jwt.verify(token, secretkey, (err, data) => {})
// Other method : jwt.decode(token) means to decode the token like what is inside the token
// We need to refresh the token after a certain period of time because the token expires after a certain period of time
