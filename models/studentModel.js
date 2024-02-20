const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  age: {
    type: String,
    default: 18,
    max: [80,"Too old in this school"]
  },
  major: String,
  scholarship:{
    merit: {
      type: Number,
      min: 0,
      max: [5000,"Too much in merit"]
    },
    other: {
      type: Number,
      min: 0
    },
  }
})

// // create a modal for students 會自動轉為 students
// // model 內第一個字大寫且單數
const Student = mongoose.model("Student", studentSchema)

module.exports = Student;