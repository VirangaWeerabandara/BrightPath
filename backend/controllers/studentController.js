const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create JWT token
const createToken = (_id) => {
  if (!process.env.SECRET) {
    throw new Error("JWT SECRET must be defined in environment variables");
  }
  return jwt.sign({ _id, role: "student" }, process.env.SECRET, {
    expiresIn: "3d",
  });
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
      role: "student",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupStudent };
