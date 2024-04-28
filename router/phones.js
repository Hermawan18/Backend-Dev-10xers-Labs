const express = require('express');
const phoneRouter = express.Router();
const phoneController = require('../controllers/phoneController');
const authentication = require('../middleware/authentication');

phoneRouter.use(authentication);
phoneRouter.get('/', phoneController.getAllPhones);

module.exports = phoneRouter;
