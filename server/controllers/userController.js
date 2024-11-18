// const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcrypt');
// const User = require('../Models/userModel');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const registerUser = asyncHandler(async (req, res) => {
// 	const {
// 		email,
// 		first_name,
// 		last_name,
// 		age,
// 		blood_group,
// 		gender,
// 		phone_number,
// 		password
// 	} = req.body;

// 	//check if all fields arre provided
// 	if (
// 		!email ||
// 		!first_name ||
// 		!last_name ||
// 		!age ||
// 		!blood_group ||
// 		!gender ||
// 		!phone_number ||
// 		!password
// 	) {
// 		res.status(400);
// 		throw new Error('please provides all fields');
// 	}
// 	// Check if user already exists in the database
// 	// await User.findOne({ email: email }) : This line of code checks if the user already exists in the database. If the user exists, it will return a message saying "User already exists". If the user does not exist, it will create a new user.
// 	const userExists = await User.findOne({ email });
// 	if (userExists) {
// 		return res.status(400).json({ message: 'user already exists' });
// 	}

// 	//Hash the password
// 	const salt = await bcrypt.genSalt(10);
// 	const hashedPassword = await bcrypt.hash(password, salt);

// 	//Create user
// 	const user = await User.create({
// 		email,
// 		first_name,
// 		last_name,
// 		age,
// 		blood_group,
// 		gender,
// 		phone_number,
// 		password: hashedPassword
// 	});
// 	res.status(201).json({ message: 'User registered successfully', user });
// });

// const loginUser = asyncHandler(async (req, res) => {
// 	const { email, password } = req.body;

// 	// Check if email and password are provided
// 	if (!email || !password) {
// 		res.status(400);
// 		throw new Error('Please provide email and password');
// 	}

// 	// Find user by email
// 	const user = await User.findOne({ email });
// 	if (!user) {
// 		return res.status(400).json({ message: 'User not found' });
// 	}

// 	// Check if password is correct
// 	const isMatch = await bcrypt.compare(password, user.password);
// 	if (!isMatch) {
// 		return res.status(400).json({ message: 'Invalid credentials' });
// 	}

// 	// Successful login response
// 	res.status(200).json({
// 		message: 'Login successful',
// 		user: {
// 			email: user.email,
// 			first_name: user.first_name,
// 			last_name: user.last_name
// 		}
// 	});

// 	res.status(200).json({
// 		message: 'Login successful',
// 		user: {
// 			email: user.email,
// 			first_name: user.first_name,
// 			last_name: user.last_name
// 		}
// 	});
// });
// module.exports = { registerUser, loginUser };

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
require('dotenv').config();

const registerUser = asyncHandler(async (req, res) => {
	const {
		email,
		first_name,
		last_name,
		age,
		blood_group,
		gender,
		phone_number,
		password
	} = req.body;

	//check if all fields arre provided
	if (
		!email ||
		!first_name ||
		!last_name ||
		!age ||
		!blood_group ||
		!gender ||
		!phone_number ||
		!password
	) {
		res.status(400);
		throw new Error('please provides all fields');
	}
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({ message: 'user already exists' });
	}

	//Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//Create user
	const user = await User.create({
		email,
		first_name,
		last_name,
		age,
		blood_group,
		gender,
		phone_number,
		password: hashedPassword
	});
	res.status(201).json({ message: 'User registered successfully', user });
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check if email and password are provided
	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide email and password');
	}

	// Find user by email
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ message: 'User not found' });
	}

	// Check if password is correct
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	// Successful login response
	// res.status(200).json({ message: "Login successful", user: { email: user.email, first_name: user.first_name, last_name: user.last_name } });

	// Generate JWT token (optional for authentication)
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '1d'
	});

	res.status(200).json({
		message: 'Login successful',
		token,
		user: {
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name
		}
	});
});

const getuserprofile = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			age: user.age,
			blood_group: user.blood_group,
			gender: user.gender,
			phone_number: user.phone_number
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

const updateUserProfile = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body; // Assume email is provided in the request body to identify the user

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Update fields only if they are provided
		const {
			first_name,
			last_name,
			age,
			blood_group,
			gender,
			phone_number,
			password
		} = req.body;

		if (first_name) user.first_name = first_name;
		if (last_name) user.last_name = last_name;
		if (age) user.age = age;
		if (blood_group) user.blood_group = blood_group;
		if (gender) user.gender = gender;
		if (phone_number) user.phone_number = phone_number;

		// If password is provided, hash it before updating
		if (password) {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
		}

		// Save the updated user
		await user.save();

		// Respond with success message and updated user details
		res.status(200).json({
			message: 'Profile updated successfully',
			user: {
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				age: user.age,
				blood_group: user.blood_group,
				gender: user.gender,
				phone_number: user.phone_number
			}
		});
	} catch (error) {
		// Handle any unexpected errors
		res.status(401).json({ message: 'error' });
	}
});

module.exports = { registerUser, loginUser, getuserprofile, updateUserProfile };
