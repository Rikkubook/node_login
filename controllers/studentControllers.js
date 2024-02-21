const User = require('../models/userModel');
const Student = require('../models/studentModel');

const studentViewControl = {
  getStudentsList: async (req, res) => {
    try {
      let data = await User.find();
      res.render('students/studentsList', { students: data, user: req.user });
    } catch (error) {
      console.log(error);
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getStudent: async (req, res) => {
    try {
      let { id } = req.params;
      let userData = await User.findById(id);
      let userInfo = await Student.findOne({ name: id });

      if (!userData) {
        throw '沒有這位使用者';
      }
      if (!userInfo) {
        res.redirect(`/students/studentInsert/${id}`);
      } else {
        res.redirect(`/students/studentPage/${id}`);
      }
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getStudentInsert: async (req, res) => {
    try {
      let { id } = req.params;
      let userData = await User.findById(id);
      let data = {
        id: id,
        name: userData.name,
        email: userData.email,
      };
      res.render('students/studentInsert', { student: data, user: req.user });
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getStudentEdit: async (req, res) => {
    try {
      let { id } = req.params;
      let userData = await User.findById(id);
      let userInfo = await Student.findOne({ name: id });
      let data = {
        id: id,
        name: userData.name,
        email: userData.email,
        age: userInfo.age,
        major: userInfo.major,
        scholarship: userInfo.scholarship,
      };
      res.render('students/studentEdit', { student: data, user: req.user });
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getStudentPage: async (req, res) => {
    try {
      let { id } = req.params;
      let userData = await User.findById(id);
      let userInfo = await Student.findOne({ name: id });
      let data = {
        id: id,
        name: userData.name,
        email: userData.email,
        age: userInfo.age,
        major: userInfo.major,
        scholarship: userInfo.scholarship,
      };
      res.render('students/studentPage', { student: data, user: req.user });
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getStudentDelete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        throw '沒有這位使用者';
      }
      await User.findByIdAndDelete(id);

      res.redirect(`/students/studentsList`);
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  getErrorPage: async (req, res) => {
    let errorMessage = req.flash('error');
    if (errorMessage[0]?.message) {
      errorMessage = errorMessage[0]?.message;
    }
    res.render('students/errorPage', { errorMessage, user: req.user });
  },
  postStudentInsert: async (req, res) => {
    try {
      let { id } = req.params;
      let data = req.body;

      const userInfo = await Student.findOne({ name: id });

      // 沒有才新增
      if (!userInfo) {
        await Student.create({
          name: id,
          age: data.age,
          major: data.major,
          scholarship: {
            merit: data.merit,
            other: data.other,
          },
        });
        res.redirect(`/students/studentPage/${id}`);
      } else {
        throw '已有此位使用者資料';
      }
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
  postStudentEdit: async (req, res) => {
    try {
      let { id } = req.params;
      let data = req.body;
      let newData = {};

      const newArray = Object.entries(data);
      newArray.filter((item) => {
        if (item[1]) {
          newData[item[0]] = item[1];
        }
      });

      const resultPage = await Student.findOneAndUpdate({ name: id }, newData);
      if (resultPage == null) {
        throw '查無此id';
      }

      res.redirect(`/students/studentPage/${id}`);
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/errorPage');
    }
  },
};

module.exports = { studentViewControl };
