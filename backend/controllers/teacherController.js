const Teacher = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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

const updateTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, nic } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid teacher ID format" });
    }

    // Validate inputs
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email is being changed and if it's already in use
    const existingTeacher = await Teacher.findOne({ email, _id: { $ne: id } });
    if (existingTeacher) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { firstName, lastName, email, nic },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from the response

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTeacherPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid teacher ID format" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, teacher.password);
    if (!match) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Update password
    teacher.password = hash;
    await teacher.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupTeacher,
  updateTeacherProfile,
  updateTeacherPassword,
};
