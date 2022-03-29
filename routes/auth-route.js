const router = require("express").Router();
const passport = require("passport");


router.get("/login",(req,res)=>{
  res.render("login");
})

router.get("/google",
  passport.authenticate("google",{ //對 google做驗證 middle
    scope:["profile"], //他的個人資料，也可以針對單獨的  scope:["email"]
    session: false
  })
)

router.get("/google/redirect",
  passport.authenticate("google"),(req,res)=>{
    console.log(res)
    res.redirect("/profile")
  }
)

module.exports = router;