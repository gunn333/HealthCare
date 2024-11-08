const jwt = require('jsonwebtoken');

// Generate JSON Web Token
const generateToken = userData => {
	return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 400000 });
};

// Verify JSON Web Token
const jwtAuthMiddleware = (req, res, next) => {
	// authcheck in simple terms is the token that is sent in the header of the request from the client
	// authorization in simple terms is the key that is used to send the token in the header of the request from the client
	// req.headers.token cannot be used because the key is authorization as by default but can be changed
	const authcheck = req.headers.authorization;
	// authcheck is basically tokencheck

	// Case1. User ne request header me token naam ka kuch bheja hi nahi

	// If the token is not available or not in request header
	if (!authcheck) {
		// Code willbe : 401 -> Unauthorized User
		// Whereas, 403 -> Forbidden User
		// 402 -> Payment Required , 404 -> Not Found , 200 -> OK
		return res.status(401).json({ message: 'Token not available' });
	}

	// Case2. Request header se token aa rha hai but not in a proper format
	// Formating of token -> Basic, Bearer
	// Basic -> btoa(username:password) -> base64 encoded

	// If the token is present
	// A Bearer token is a type of access token that allows the user to prove their identity and gain access to a resource or service. It’s called "Bearer" because the client "bears" (carries) the token to authenticate themselves. The token is signed by the server to ensure it hasn’t been tampered with.
	// We need to remove the Bearer prefix from the token for example: Bearer abc.def.ghi -> after removing Bearer -> abc.def.ghi -> this is the token
	// The prefix Bearer is not part of the JWT itself. If the entire header string is used for validation, it will result in errors because the JWT library expects only the actual token, not the prefix.
	const token = authcheck.split(' ')[1];
	// 1 is the index of the token in the array after splitting the string like Bearer abc.def.ghi -> after splitting -> ['Bearer', 'abc.def.ghi'] -> token is at index 1

	// If the token is not present
	if (!token) {
		// If the response is 401, it means that the client is not authorized to access the resource and should provide valid credentials.
		return res.status(401).json({ message: 'Unauthorized User' });
	}
	// If the token is present
	try {
		// Verify the token
		const validateToken = jwt.verify(token, process.env.JWT_SECRET);
		// If the token is valid
		// Add the user data to the request object
		req.user = validateToken;
		// Move to the next middleware
		next();
	} catch (error) {
		// If the token is invalid
		// If the response is 403, it means that the client is authorized to access the resource but is forbidden from doing so.
		console.error('Error occurred: ', err.message);
		return res.status(401).json({ err: 'Invalid token' });
	}
};

module.exports = { generateToken, jwtAuthMiddleware };