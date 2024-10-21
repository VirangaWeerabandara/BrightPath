const express = require('express');

const {
    loginTeacher,
    signupTeacher
} = require('../controllers/teacherController');


const router = express.Router();

//login route
router.post('/login/teacher',loginTeacher)


//signup route
router.post('/signup/teacher',signupTeacher)


module.exports = router;