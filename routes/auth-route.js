const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt"); //加密
const User = require("../models/user-model")
const flash = require("connect-flash")

router.get("/login",(req,res)=>{
  res.render("login",{user: req.user});
})

router.get("/signup",(req,res)=>{
  res.render("signup",{user: req.user});
})

router.post("/signup",async (req,res)=>{
  console.log(req.body);
  let {name, email, password} = req.body;
  // check if the data is already
  const emailExist = await User.findOne({email})
  // if (emailExist) return res.status(400).send("Email already exist");
  if (emailExist){
    req.flash("error_msg","Email has already");
    res.redirect("/auth/signup");
  }

  const hash = await bcrypt.hash(password,10); //密碼加密
  password = hash;
  let newUser =new User({name , email , password})

  try{
    // const savedUser = await newUser.save();
    // res.status(200).send({
    //   msg: "User saved.",
    //   saveObj: savedUser
    // })
    await newUser.save();
    req.flash("success_msg","Registration succeeds")
    res.redirect("/auth/login")
  } catch(error){
    req.flash("error_msg", error.errors.name.properties.message);
    res.redirect("/auth/signup")
  }
})

router.get("/google",
  passport.authenticate("google",{ //對 google做驗證 middle
    scope:["profile", "email"], //他的個人資料，也可以針對單獨的  scope:["email"]
    session: false
  })
)
router.get("/logout",(req,res)=>{
  req.logOut(); //登出
  res.redirect("/");
})
router.get("/google/redirect",
  passport.authenticate("google"),(req,res)=>{
    res.redirect("/profile")
  }
)

module.exports = router;