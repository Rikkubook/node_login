const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CONNECT_ID,
  clientSecret: process.env.GOOGLE_CONNECT_SECRET,
  callbackURL: "auth/google/redirect"
  },()=>{
    // passport callback
  }
))