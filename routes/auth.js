const express = require('express');
const router = express.Router();
const authControl = require('../controllers/authControllers');
const { passLogin, passGoogle, passGoogleRedirect } = require('../service/passport');

router.get('/login', authControl.getLogin);

router.post('/login', passLogin, authControl.postLogin);

router.get('/signup', authControl.getSignup);

router.post('/signup', authControl.postSignup);

router.get('/logout', authControl.logout);

router.get('/google', passGoogle);

// https://node-login-beta.vercel.app/auth/google/redirect
router.get('/google/redirect', passGoogleRedirect, authControl.googleRedirect);

module.exports = router;
