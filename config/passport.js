const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require("../models/user-model");

passport.serializeUser(function(user, done) {
  console.log('serializeUser user now')
  done(null, user._id); // 撈mongoDB的_id
});

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CONNECT_ID,
  clientSecret: process.env.GOOGLE_CONNECT_SECRET,
  callbackURL: "/auth/google/redirect"
  },(accessToken, refreshToken,profile, done)=>{
    console.log(profile)
    User.findOne({googleID : profile.id}).then((foundUser)=>{
      if(foundUser){ //如果資料庫內有使用者
        console.log("User already exists");
        done(null, foundUser);
      }else{ //如果資料庫內沒使用者
        new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value
        }).save().then((newUser)=>{
          console.log("New user exists");
          done(null, newUser);
        })
      }
    });

  }
))