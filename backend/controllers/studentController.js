const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
}

//login Student
const loginStudent = async (req, res) => {
    const {email, password} = req.body;

    try{
        const student = await Student.login(email, password);

        //create token
        const token = createToken(student._id);

        res.status(201).json({email, token});
    } catch(error){
        res.status(400).json({error: error.message});
    }
}

//signup Student
const signupStudent = async (req, res) => {
    const {email, password} = req.body;

    try{
        const student = await Student.signup(email, password);

        //create token
        const token = createToken(student._id);

        res.status(201).json({email, token});
    } catch(error){
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    loginStudent,
    signupStudent
}