const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  googleID: {
    // gmail登入的ID
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    // gmail登入的縮圖
    type: String,
  },
  //Local Loging
  email: {
    type: String,
  },
  identity: {
    type: String,
  },
  password: {
    type: String,
    maxLength: 1024,
  },
});

module.exports = mongoose.model('User', userSchema);
