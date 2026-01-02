const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Course = require("../models/courseModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Validate courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    // Validate studentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Find the student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Initialize courses array if it doesn't exist
    if (!student.courses) {
      student.courses = [];
    }

    // Check if already enrolled (compare as strings to handle ObjectId comparison)
    const isAlreadyEnrolled = student.courses.some(
      (enrolledCourseId) => enrolledCourseId.toString() === courseId
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Add course to student's courses
    student.courses.push(new mongoose.Types.ObjectId(courseId));
    await student.save();

    // Initialize enrolledStudents array if it doesn't exist
    if (!course.enrolledStudents) {
      course.enrolledStudents = [];
    }

    // Add student to course's enrolledStudents
    course.enrolledStudents.push(new mongoose.Types.ObjectId(studentId));
    await course.save();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
      courseId: courseId,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await Student.findById(studentId).populate({
      path: "courses",
      select: "name description category thumbnails videos _id teacherId",
      populate: {
        path: "teacherId",
        select: "firstName lastName",
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      success: true,
      courses: student.courses,
    });
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, currentPassword, newPassword } = req.body;
    const studentId = req.user._id;

    const student = await Student.findById(studentId);
    if (!student) {
      throw Error("Student not found");
    }

    // Verify current password if updating password
    if (newPassword) {
      const match = await bcrypt.compare(currentPassword, student.password);
      if (!match) {
        throw Error("Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      student.password = hash;
    }

    // Update other fields
    student.firstName = firstName;
    student.lastName = lastName;

    await student.save();

    res.status(200).json({
      success: true,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupStudent,
  enrollInCourse,
  getEnrolledCourses,
  updateProfile,
};
