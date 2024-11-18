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

app.get('/', (req, res) => {
	res.send('working');
});

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
app.use('/api/accdetails', require('./Routes/myAccount'));
app.use('/api/newsletter', require('./Routes/newsletterRoutes'));

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
