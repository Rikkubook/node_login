const isTeacher = function (req, res, next) {
  console.log(req.session);
  if (('isVerify', req.session.isVerify)) {
    next(); // 繼續處理下一個中間件或路由
  } else {
    req.flash('error', '未授權');
    res.redirect('/students/errorPage');
  }
};

const authLogin = (req, res, next) => {
  console.log('驗證登入');
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

module.exports = {
  isTeacher,
  authLogin,
};
