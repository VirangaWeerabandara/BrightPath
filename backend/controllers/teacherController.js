const Teacher = require('../models/studentModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
}

//login Student
const loginTeacher = async (req, res) => {
    const {email, password} = req.body;

    try{
        const teacher = await Teacher.login(email, password);

        //create token
        const token = createToken(teacher._id);

        res.status(201).json({email, token});
    } catch(error){
        res.status(400).json({error: error.message});
    }
}

//signup Student
const signupTeacher = async (req, res) => {
    const {email, password} = req.body;

    try{
        const teacher = await Teacher.signup(email, password);

        //create token
        const token = createToken(teacher._id);

        res.status(201).json({email, token});
    } catch(error){
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    loginTeacher,
    signupTeacher
}