const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/signup', userController.signUp);
router.post('/login', userController.loginUser);

module.exports = router;
