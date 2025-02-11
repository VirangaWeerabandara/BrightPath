const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Course = require("../models/courseModel"); // Add this import
const mongoose = require("mongoose");
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Find the student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student) {
      throw new Error("Student not found");
    }
    if (!course) {
      throw new Error("Course not found");
    }

    // Initialize courses array if it doesn't exist
    if (!student.courses) {
      student.courses = [];
    }

    // Check if already enrolled
    if (student.courses.includes(courseId)) {
      throw new Error("Already enrolled in this course");
    }

    // Add course to student's courses
    student.courses.push(courseId);
    await student.save({ session });

    // Initialize enrolledStudents array if it doesn't exist
    if (!course.enrolledStudents) {
      course.enrolledStudents = [];
    }

    // Add student to course's enrolledStudents
    course.enrolledStudents.push(studentId);
    await course.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
      courseId: courseId,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
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
module.exports = {
  signupStudent,
  enrollInCourse,
  getEnrolledCourses,
};
