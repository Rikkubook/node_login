const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');

const authCheck = (req, res, next) => {
  //middleware
  console.log('驗證登入');
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

router.get('/', authCheck, postControllers.getProfile);

router.get('/post', authCheck, postControllers.getProfilePost);

router.post('/post', authCheck, postControllers.postProfilePost);

module.exports = router;
