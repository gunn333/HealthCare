const asyncHandler = require('express-async-handler');
const Newsletter = require('../Models/newsletterModel');
const getNewsletter = asyncHandler(async (req, res) => {
	try {
		const data = await Newsletter.find({});
	} catch (err) {
		res.status(404).json({ err: err.message });
	}
});
const createNewsletter = asyncHandler(async (req, res) => {});
module.exports = { getNewsletter, createNewsletter };
