const router = require("express").Router();
const passport = require("passport")

router.get("/login",(req,res)=>{
  res.render("login");
})

router.get("/google",
  passport.authenticate("google",{ //對 google做驗證
    scope:["profile"] //他的個人資料，也可以針對單獨的  scope:["email"]
  })
)

module.exports = router;