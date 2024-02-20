const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  content:{
    type: String,
    required: true,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  author:{
    type: String
  }
})

module.exports = mongoose.model("Post", postSchema)