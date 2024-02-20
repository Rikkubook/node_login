const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userModel');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt'); //加密

// 可設定要將哪些 user 資訊，儲存在 Session 中的
passport.serializeUser(function (user, done) {
  console.log('儲存在 Session');
  done(null, user._id); // 撈mongoDB的_id
});

// 可藉由從 Session 中獲得的資訊去撈該 user 的資料
passport.deserializeUser(function (_id, done) {
  User.findById({ _id })
    .then((user) => {
      console.log('取得 Session user');
      done(null, user);
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      done(error);
    });
});

// 本地端設定
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log('登入確認 user');
    User.findOne({ email: username })
      .then(async (user) => {
        if (!user) {
          return done(null, false); //使用者不存在 則不用驗證
        }

        // 密碼比對
        await bcrypt.compare(password, user.password, function (error, result) {
          if (error) {
            return done(error);
          }
          if (!result) {
            return done(null, false);
          } else {
            return done(null, user);
            //這邊會設定有user 惠儲存在 sessions 內並且透過 isAuthenticated 進行身分驗證
          }
        });
      })
      .catch((error) => {
        return done(error);
      });
  }),
);

// 第三方驗證設定
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CONNECT_ID,
      clientSecret: process.env.GOOGLE_CONNECT_SECRET,
      callbackURL: '/auth/google/redirect', //轉址
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('google', profile);
      User.findOne({ googleID: profile.id })
        .then((foundUser) => {
          if (foundUser) {
            //如果資料庫內有使用者
            console.log('User already exists');
            done(null, foundUser);
          } else {
            //如果資料庫內沒使用者
            new User({
              name: profile.displayName,
              googleID: profile.id,
              thumbnail: profile.photos[0].value,
              email: profile.emails[0].value,
            })
              .save()
              .then((newUser) => {
                console.log('New user exists');
                done(null, newUser);
              });
          }
        })
        .catch((error) => {
          console.error('Error finding user:', error);
          done(error);
        });
    },
  ),
);
