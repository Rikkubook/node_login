const User = require('../models/userModel');
const bcrypt = require('bcrypt'); //加密

const authControl = {
  getLogin: (req, res) => {
    res.render('login', { user: req.user });
  },
  postLogin: (req, res) => {
    let { identity } = req.user;
    if (identity === 'Teacher') {
      req.session.isVerify = true;
    }
    res.redirect('/profile');
  },
  getSignup: (req, res) => {
    res.render('signup', { user: req.user });
  },
  postSignup: async (req, res) => {
    try {
      let { name, email, password, identity } = req.body;
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        throw { errors: '信箱已註冊' };
      }

      const hash = await bcrypt.hash(password, 10); //密碼加密
      password = hash;
      const newUser = new User({ name, email, password, identity });

      await newUser.save();

      if (identity === 'Teacher') {
        req.session.isVerify = true;
      }

      req.flash('success_msg', 'Registration succeeds');
      res.redirect('/auth/login');
    } catch (error) {
      req.flash('error_msg', error.errors);
      res.redirect('/auth/signup');
    }
  },
  logout: (req, res) => {
    req.logOut(); //登出
    res.redirect('/');
  },
  googleRedirect: (req, res) => {
    res.redirect('/profile');
  },
};

module.exports = authControl;
