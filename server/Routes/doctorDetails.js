const express = require('express');

const { jwtAuthMiddleware } = require('../Middleware/jwtMiddleware');
const router = express.Router();
const {
	docDetails,
	getDoctors
} = require('../controllers/doctorDetailsController');

//route for registration
router.post('/details', jwtAuthMiddleware, docDetails);

// GET route for retrieving doctor details
router.get('/details', getDoctors); // New GET route
//route for user login
//router.post("/login",loginUser);
module.exports = router;
