const express = require('express');
const router = express.Router();
const {
	getNewsletter,
	createNewsletter
} = require('../controllers/newsletterController');
router.get('/', getNewsletter);
router.post('/', jwtAuthMiddleware, createNewsletter);
