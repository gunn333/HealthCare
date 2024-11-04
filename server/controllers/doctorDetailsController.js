const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const doctor = require('../Models/doctorDetailsModel');
require('dotenv').config();

const docDetails = asyncHandler(async (req, res) => {
	const { name, speciality, phoneNumber, experience, address } = req.body;
	if (!name || !speciality || !phoneNumber || !experience || !address) {
		res.status(400);
		throw new Error('Please provide all fields');
	}

	const userExists = await doctor.findOne({ name });
	if (userExists) {
		return res.status(400).json({ message: 'user already exists' });
	}
	// //hash the password
	// const salt = await bcrypt.genSalt(10);
	// const hashedPassword = await bcrypt.hash(password,salt);

	//create the user
	const Doctor = await doctor.create({
		name,
		speciality,
		phoneNumber,
		experience,
		address
	});

	res.status(201).json({ message: 'Doctor details found', Doctor });
});

// GET route for retrieving all doctor details
const getDoctors = asyncHandler(async (req, res) => {
	const doctors = await doctor.find({});
	res.status(200).json(doctors);
});
module.exports = { docDetails, getDoctors };
