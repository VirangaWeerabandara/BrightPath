const express = require('express');

const {
    loginStudent,
    signupStudent
} = require('../controllers/studentController');


const router = express.Router();

//login route
router.post('/login/student',loginStudent)


//signup route
router.post('/signup/student',signupStudent)


module.exports = router;