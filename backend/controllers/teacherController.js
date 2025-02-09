const Teacher = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (_id) => {
  if (!process.env.SECRET) {
    throw new Error("JWT SECRET must be defined in environment variables");
  }
  return jwt.sign({ _id, role: "teacher" }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

const signupTeacher = async (req, res) => {
  const { firstName, lastName, nic, email, password } = req.body;

  try {
    if (!firstName || !lastName || !nic || !email || !password) {
      throw Error("All fields must be filled");
    }

    const teacher = await Teacher.signup(
      firstName,
      lastName,
      nic,
      email,
      password
    );
    const token = createToken(teacher._id);

    res.status(201).json({
      email,
      token,
      firstName,
      lastName,
      nic,
      role: "teacher",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupTeacher,
};
