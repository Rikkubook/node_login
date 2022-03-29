const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    require: true,
    minLength: 2,
    maxLength: 255,
  },
  googleID:{
    type: String,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  thumbnail:{
    type: String
  },
  //Local Loging
  email:{
    type: String
  },
  password:{
    type: String,
    maxLength: 1024
  }
})

module.exports = mongoose.model("User", userSchema)