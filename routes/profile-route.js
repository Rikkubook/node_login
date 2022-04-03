const router = require("express").Router();
const passport = require("passport");

const authCheck = (req, res, next) => { //middleware
  console.log(req.user)
  if(!req.isAuthenticated()) {
    res.redirect("/auth/login")
  }else{
    next()
  }
}

router.get("/",authCheck,(req,res)=>{
  res.render("profile",{user: req.user});
})

module.exports = router;