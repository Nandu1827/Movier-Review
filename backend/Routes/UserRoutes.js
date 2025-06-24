const express = require('express');
const router = express.Router();
const { signUp, signIn, adminSignIn } = require('../controller/UserController');

// Public routes
router.post('/signup', signUp); // User signup
router.post('/signin', signIn); // User signin
router.post('/admin/signin', adminSignIn); // Admin signin

module.exports = router;