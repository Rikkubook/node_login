const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');
const { authLogin } = require('../middleware/auth');

router.get('/', authLogin, postControllers.getProfile);

router.get('/post', authLogin, postControllers.getProfilePost);

router.post('/post', authLogin, postControllers.postProfilePost);

module.exports = router;
