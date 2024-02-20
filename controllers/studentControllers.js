const User = require('../models/userModel');
const Student = require('../models/studentModel');
const bcrypt = require('bcrypt'); //加密
const validator = require('validator');

const memberControl = {
  getSignup: async (req, res) => {
    const errorMessage = req.flash('error');
    res.render('signup', { errorMessage });
  },
  postSignup: async (req, res) => {
    try {
      const data = req.body;
      const { email } = data;
      if (!data.name) {
        throw '使用者名稱不為空'; // 會丟到catch的error
      } else if (!data.email) {
        throw 'Email不為空';
      } else if (!data.password) {
        throw '密碼不為空';
      }

      if (!validator.isLength(data.name, { min: 2 })) {
        throw '暱稱兩字以上';
      }
      if (!validator.isLength(data.password, { min: 8 })) {
        throw '密碼不可小於 8 碼';
      }

      let findUser = await User.findOne({ email });
      if (findUser) {
        throw '已有使用者';
      }

      data.password = await bcrypt.hash(data.password, 3);

      await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      req.session.isVerify = true;
      res.redirect(`/students/studentsList`);
    } catch (error) {
      // errorHandler(res,error,400)
      req.flash('error', error);
      res.redirect('/students/signup');
    }
  },
  getLogin: async (req, res) => {
    const errorMessage = req.flash('error');
    res.render('login', { errorMessage });
  },
  postLogin: async (req, res) => {
    try {
      const data = req.body;
      if (!data.email) {
        throw 'Email不為空';
      } else if (!data.password) {
        throw '密碼不為空';
      }

      const user = await User.findOne({ email: data.email }).select('+password'); // 為了要把預設不顯示的取出，添加+
      if (user) {
        // 密碼驗證
        const result = await comparePasswords(data.password, user.password);
        if (result) {
          req.session.isVerify = true;
          res.redirect(`/students/studentsList`);
        } else {
          throw '密碼驗證不相符';
        }
      } else {
        throw '尚未註冊';
      }

      async function comparePasswords(plainPassword, hashedPassword) {
        try {
          const result = await bcrypt.compare(plainPassword, hashedPassword);
          return result;
        } catch (error) {
          console.error('密碼比對失敗:', error);
          throw error;
        }
      }
    } catch (error) {
      req.flash('error', error);
      res.redirect('/students/login');
    }
  },
};

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
      res.render('students/studentInsert', { student: data });
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
      res.render('students/studentEdit', { student: data });
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
      res.render('students/studentPage', { student: data });
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
    res.render('students/errorPage', { errorMessage });
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

module.exports = { memberControl, studentViewControl };
