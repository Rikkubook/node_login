const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt"); //加密
const User = require("../models/user-model")

router.get("/login",(req,res)=>{
  res.render("login",{user: req.user});
})

router.post("/login",
  passport.authenticate("local", { // 身分驗證
    failureRedirect: "/auth/login",
    failureFlash: "錯誤的信箱與密碼",
  }),(req, res) => {
    res.redirect("/profile")
  }
);

router.get("/signup",(req,res)=>{
  res.render("signup",{user: req.user});
})

router.post("/signup",async (req,res)=>{
  console.log(req.body);
  let {name, email, password} = req.body;
  const emailExist = await User.findOne({email})
  if (emailExist){
    req.flash("error_msg","信箱已註冊");
    res.redirect("/auth/signup");
  }

  const hash = await bcrypt.hash(password,10); //密碼加密
  password = hash;
  let newUser =new User({name , email , password})

  try{
    await newUser.save();
    req.flash("success_msg","Registration succeeds")
    res.redirect("/auth/login")
  } catch(error){
    req.flash("error_msg", error.errors.name.properties.message);
    res.redirect("/auth/signup")
  }
})

router.get("/logout",(req,res)=>{
  req.logOut(); //登出
  res.redirect("/");
})


router.get("/google",
  passport.authenticate("google",{ //對 google做驗證 middle
    scope:["profile", "email"], //他的個人資料，也可以針對單獨的  scope:["email"]
    session: false
  })
)

router.get("/google/redirect",
  passport.authenticate("google"),(req,res)=>{
    res.redirect("/profile")
  }
)

module.exports = router;