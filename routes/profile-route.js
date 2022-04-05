const router = require("express").Router();
const passport = require("passport");
const Post = require("../models/post-model")

const authCheck = (req, res, next) => { //middleware
  console.log(req.user)
  if(!req.isAuthenticated()) {
    res.redirect("/auth/login")
  }else{
    next()
  }
}

router.get("/",authCheck, async (req,res)=>{
  let postFound = await Post.find({ author: req.user._id})
  res.render("profile",{user: req.user, posts: postFound});
})

router.get("/post",authCheck,(req,res)=>{
  res.render("post",{user: req.user});
})

router.post("/post",authCheck, async (req,res)=>{
  let { title, content} = req.body;
  console.log(title, content)
  let newPost = new Post({ title, content, author: req.user._id});
  try{
    await newPost.save();
    console.log('try')
    res.status(200).redirect("/profile")
  }catch(error){
    req.flash('error_msg',"Both title ans content are required");
    res.redirect('/profile/post');
  }
})


module.exports = router;