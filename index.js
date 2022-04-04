const express = require('express');
const passport = require('passport');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/passport")

// const cookieSession = require("cookie-session")
const session = require("express-session")
const flash = require("connect-flash")

mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true, //???
  useUnifiedTopology: true, //???
}).then(()=>{
  console.log("connet to mongodb atlas")
}).catch((err)=>{
  console.log(err)
})

//middleware
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true})) // 可取代掉 bodyParser

// app.use(cookieSession({
//   keys:[process.env.SECRET]
// }))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize()) //store cookie
app.use(passport.session())

app.use(flash())
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})
app.use("/auth", authRoute) 
app.use("/profile", profileRoute) 
//每個路由都會經過看是否有/auth 再進入 authRoute
// /auth/login

app.get('/', (req, res)=>{
  res.render("index",{user: req.user})
});

app.listen(8080,()=>{
  console.log("server running on port 8080")
})
