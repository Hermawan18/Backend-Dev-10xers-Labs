const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

const signToken = (payload) => jwt.sign(payload, secret);
const verifyToken = (token) => jwt.verify(token, secret);

module.exports = { signToken, verifyToken };
