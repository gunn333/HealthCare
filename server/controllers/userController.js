const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
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
	// Check if user already exists in the database
	// await User.findOne({ email: email }) : This line of code checks if the user already exists in the database. If the user exists, it will return a message saying "User already exists". If the user does not exist, it will create a new user.
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
	res.status(200).json({
		message: 'Login successful',
		user: {
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name
		}
	});

	res.status(200).json({
		message: 'Login successful',
		user: {
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name
		}
	});
});
module.exports = { registerUser, loginUser };
