const User = require('../models/user-model')
const bcrypt = require('bcrypt') //加密

const authControl = {
  getLogin: (req, res) => {
    res.render('login', { user: req.user })
  },
  postLogin: (req, res) => {
    res.redirect('/profile')
  },
  getSignup: (req, res) => {
    res.render('signup', { user: req.user })
  },
  postSignup: async (req, res) => {
    let { name, email, password } = req.body
    const emailExist = await User.findOne({ email })
    if (emailExist) {
      req.flash('error_msg', '信箱已註冊')
      return res.redirect('/auth/signup')
    }

    const hash = await bcrypt.hash(password, 10) //密碼加密
    password = hash
    let newUser = new User({ name, email, password })

    try {
      await newUser.save()
      req.flash('success_msg', 'Registration succeeds')
      res.redirect('/auth/login')
    } catch (error) {
      console.log('postSignup', error.errors)
      req.flash('error_msg', error.errors)
      res.redirect('/auth/signup')
    }
  },
  logout: (req, res) => {
    req.logOut() //登出
    res.redirect('/')
  },
  googleRedirect: (req, res) => {
    res.redirect('/profile')
  },
}

module.exports = authControl
