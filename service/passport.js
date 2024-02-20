// 作為中間層使用
const passport = require('passport')

const passLogin = passport.authenticate('local', {
  // 身分驗證
  failureRedirect: '/auth/login',
  failureFlash: '錯誤的信箱與密碼',
})

const passGoogle = passport.authenticate('google', {
  //對 google做驗證 middle
  scope: ['profile', 'email'], //他的個人資料，也可以針對單獨的  scope:["email"]
  session: false,
})

const passGoogleRedirect = passport.authenticate('google')

module.exports = {
  passLogin,
  passGoogle,
  passGoogleRedirect,
}
