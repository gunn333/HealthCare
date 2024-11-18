// My Account Page Functionalities :
// 1. Get User specific
// 2. Update User specific

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Account = require('../Models/myAccountModel');
require('dotenv').config();

const AccountDetails = asyncHandler(async (req, res) => {
	const { id, name, phoneNumber, age, gender, address } = req.body;

	if (!id || !name || !phoneNumber || !age || !gender || !address) {
		res.status(400);
		throw new Error('Please provide all fields');
	}

	const accountExists = await Account.findOne({ id });
	if (accountExists) {
		return res.status(400).json({ message: 'User already exists' });
	}

	const newAccount = await Account.create({
		id,
		name,
		phoneNumber,
		age,
		gender,
		address
	});

	const token = jwt.sign({ id: newAccount._id }, process.env.JWT_SECRET, {
		expiresIn: '1d'
	});

	res.status(201).json({
		message: 'Account created successfully',
		token,
		user: { id: newAccount.id, name: newAccount.name }
	});
});

const getAccount = asyncHandler(async (req, res) => {
	const accounts = await Account.find({});
	res.status(200).json(accounts);
});

module.exports = {
	AccountDetails,
	getAccount
};