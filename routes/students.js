const express = require('express');
const router = express.Router();
const { authLogin, isTeacher } = require('../middleware/auth');
const { studentViewControl } = require('../controllers/studentControllers');

// 學生列表畫面
router.get('/studentsList', authLogin, isTeacher, studentViewControl.getStudentsList);
// 個人資料畫面
router.get('/studentsList/:id', authLogin, isTeacher, studentViewControl.getStudent);
// 個人新增畫面
router.get('/studentInsert/:id', authLogin, isTeacher, studentViewControl.getStudentInsert);
// 個人編輯畫面
router.get('/studentEdit/:id', authLogin, isTeacher, studentViewControl.getStudentEdit);
// 個人呈現畫面
router.get('/studentPage/:id', authLogin, isTeacher, studentViewControl.getStudentPage);
// 個人刪除畫面
router.get('/studentDelete/:id', authLogin, isTeacher, studentViewControl.getStudentDelete);
// 錯誤畫面
router.get('/errorPage', studentViewControl.getErrorPage);

// 個人新增API
router.post('/studentInsert/:id', studentViewControl.postStudentInsert);
// 個人修改API
router.post('/studentEdit/:id', studentViewControl.postStudentEdit);

module.exports = router;
