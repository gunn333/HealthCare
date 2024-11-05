// // Express
// const express = require('express');
// // Error handler is basically a middleware that catches errors that are thrown in the application
// const errorHandler = require('./Middleware/errorHandler');
// const connectDb = require('./Config/dbconnection');
// // CORS - Cross Origin Resource Sharing
// // It is a security feature implemented in browsers that restricts web pages from making requests to a different domain than the one that served the web page
// const cors = require('cors'); // cors for security at server side

// // we install dotenv locally because we don't want to expose our credentials to the public
// const dotenv = require('dotenv');
// // dotenv.config() is used to read the .env file and parse the contents
// dotenv.config();

// connectDb(); // db connection setup for crud operations
// const app = express();

// // process.env.PORT is used to get the port number from the environment variable PORT
// // If the environment variable PORT is not set, then the port number is set to 5000
// // either file is frontend or backend pass all configurations through env file only.
// const port = process.env.PORT || 5000;

// const path = require('path');
// var hbs = require('hbs');

// // Register the partials directory for hbs
// hbs.registerPartials(__dirname + '/views/partials', function (err) {});
// app.set('view engine', 'hbs');

// app.use(express.json());
// app.use(cors());
// app.use(errorHandler);

// app.get('/', (req, res) => {
// 	res.send('working');
// });

// // This is a route for the home page
// app.get('/home', (req, res) => {
// 		// let user = User.findOne({id:})
// 	res.render('home', {
// 		username: "Gunn",
// 		posts: "blah blah blah"
// 	});
// });

// // This is a route for the alluser page
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

// // app.listen() is used to bind and listen the connections on the specified host and port
// app.listen(port, () => {
// 	console.log(`Server is running on port http://localhost:${port}`);
// });

// // Which routes need to be secure and which routes need to be not secure and why
// // The routes that need to be secure are the routes that are used to access the sensitive data of the user
// // For example, the routes that are used to access the user's personal information, the routes that are used to access the user's financial information, etc.
// // These routes need to be secure because if these routes are not secure, then the sensitive data of the user can be accessed by unauthorized users
// // The routes that need to be not secure are the routes that are used to access the public data of the user
// // For example, the routes that are used to access the user's public profile, the routes that are used to access the user's public posts, etc.

// // What is the difference between HTTP and HTTPS

// // HTTP stands for Hypertext Transfer Protocol
// // HTTPS stands for Hypertext Transfer Protocol Secure
// // HTTP is used to transfer data between the client and the server while HTTPS is used to transfer data between the client and the server securely

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./Middleware/errorHandler');
const connectDb = require('./Config/dbconnection');
const cors = require('cors'); // CORS for security at the server side
const multer = require('multer');
const File = require('./Models/file');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDb();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 5000; // Set server port

// Set view engine and views path
hbs.registerPartials(__dirname + '/views/partials', err => {
	if (err) console.error('Error registering hbs partials:', err);
});
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ensure 'uploads' directory exists, or create it
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
	console.log("Created 'uploads' directory.");
}

// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads'); // Directory where files will be stored
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	}
});
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
		// Create a new file record in MongoDB
		const fileData = new File({
			originalName: req.file.originalname,
			filename: req.file.filename,
			path: req.file.path,
			size: req.file.size
		});

		await fileData.save(); // Save metadata to MongoDB
		console.log('File metadata saved:', fileData);
		return res.redirect('/home');
	} catch (error) {
		console.error('Error uploading file:', error);
		res.status(500).send('Error uploading file.');
	}
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
