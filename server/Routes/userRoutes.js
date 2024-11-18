// // const express = require('express');
// // const router = express.Router();
// // const User = require('../Models/userModel'); // Ensure the correct path to your model

// // // Route to register a new user
// // router.post('/register', async (req, res) => {
// // 	try {
// // 		// Destructure data from the request body
// // 		const {
// // 			firstName,
// // 			lastName,
// // 			age,
// // 			bloodGroup,
// // 			gender,
// // 			phoneNumber,
// // 			password
// // 		} = req.body;

// // 		// Create a new user instance
// // 		const newUser = new User({
// // 			firstName,
// // 			lastName,
// // 			age,
// // 			bloodGroup,
// // 			gender,
// // 			phoneNumber,
// // 			password
// // 		});

// // 		// Save the user to the database
// // 		await newUser.save();

// // 		// Send a success response
// // 		res.status(201).json({
// // 			message: 'User registered successfully',
// // 			user: newUser
// // 		});
// // 	} catch (error) {
// // 		console.error(error);

// // 		// Send an error response
// // 		res.status(400).json({
// // 			message: 'Error registering user',
// // 			error: error.message
// // 		});
// // 	}
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/userController');
// const { jwtAuthMiddleware } = require('../Middleware/jwtMiddleware');

// // Route for user registration
// router.post('/register', registerUser);

// // Route for user login
// router.post('/login', loginUser);

// // Example of a protected route that requires JWT
// router.get('/protected', jwtAuthMiddleware, (req, res) => {
// 	res.status(200).json({
// 		message: 'This is a protected route',
// 		user: req.user
// 	});
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getuserprofile,
	updateUserProfile
} = require('../controllers/userController');
const { generateToken } = require('../Middleware/jwtMiddleware');

//route for user registration
router.post('/register', registerUser);
router.post('/login', generateToken, loginUser);

// Secure route that requires JWT authentication
router.get('/secure-data', generateToken, (req, res) => {
	res.json({ message: 'This is a secure data route' });
});

// Route to get user profile
router.post('/myaccount', generateToken, getuserprofile);

// Route to update user profile
router.patch('/myaccount', generateToken, updateUserProfile);

module.exports = router;