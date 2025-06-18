const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/userController');
const { googleAuth, googleAuthCallback } = require('../controller/googleAuthController');
const passport = require('passport');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Auth Routes
router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

module.exports = router; 