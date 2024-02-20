const Post = require('../models/postModel');

const postControllers = {
  getProfile: async (req, res) => {
    try {
      console.log();
      let postFound = await Post.find({ author: req.user._id });
      res.render('profile', { user: req.user, posts: postFound });
    } catch (error) {
      req.flash('error_msg', error.errors);
      res.redirect('/');
    }
  },
  getProfilePost: (req, res) => {
    res.render('post', { user: req.user });
  },
  postProfilePost: async (req, res) => {
    try {
      let { title, content } = req.body;
      console.log(title, content);
      let newPost = new Post({ title, content, author: req.user._id });

      await newPost.save();
      res.status(200).redirect('/profile');
    } catch (error) {
      req.flash('error_msg', 'Both title ans content are required');
      res.redirect('/profile/post');
    }
  },
};

module.exports = postControllers;
