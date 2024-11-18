const express = require('express');
const router = express.Router();
const {
	AccountDetails,
	getAccount
} = require('../controllers/myAccountDetails');
const { validateJwtToken } = require('../Middleware/jwtMiddleware');

// POST route for account creation and token generation
router.post('/accdetails', AccountDetails);

// GET route for fetching accounts, protected by JWT
router.get('/accdetails', validateJwtToken, getAccount);

module.exports = router;
