const router = require("express").Router();
const passport = require("passport");

router.get("/",(req,res)=>{
  res.redirect("profile");
})

module.exports = router;