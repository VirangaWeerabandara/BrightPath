const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create JWT token
const createToken = (_id) => {
  if (!process.env.SECRET) {
    throw new Error("JWT SECRET must be defined in environment variables");
  }
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login controller
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);
    const token = createToken(student._id);

    res.status(200).json({
      email,
      token,
      firstName: student.firstName,
      lastName: student.lastName,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup controller
const signupStudent = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      throw Error("All fields must be filled");
    }

    const student = await Student.signup(firstName, lastName, email, password);
    const token = createToken(student._id);

    res.status(201).json({
      email,
      token,
      firstName,
      lastName,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginStudent,
  signupStudent,
};
