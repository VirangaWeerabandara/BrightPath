const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const mongoose = require("mongoose");

// Helper function to handle errors
const handleError = (error, res) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "An error occurred",
    error: error.message,
  });
};

// Create Course
const createCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      description,
      videos,
      thumbnails,
      titles,
      teacherId,
      category,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !videos ||
      !thumbnails ||
      !titles ||
      !teacherId ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: {
          name: !name,
          description: !description,
          videos: !videos,
          thumbnails: !thumbnails,
          titles: !titles,
          teacherId: !teacherId,
          category: !category,
        },
      });
    }

    // Validate arrays have matching lengths
    if (
      videos.length !== thumbnails.length ||
      videos.length !== titles.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Videos, thumbnails, and titles must have the same number of items",
      });
    }

    // Validate teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const newCourse = new Course({
      name,
      description,
      videos,
      thumbnails,
      titles,
      teacherId,
      category,
      enrolledStudents: [],
    });

    const savedCourse = await newCourse.save({ session });

    // Add course to teacher's courses array
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { courses: savedCourse._id } },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, res);
  } finally {
    session.endSession();
  }
};
// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacherId", "firstName lastName email")
      .select("-enrolledStudents");

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Get Course By ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(id)
      .populate("teacherId", "firstName lastName email")
      .populate("enrolledStudents", "firstName lastName email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Update Course
const updateCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Validate the updates
    if (!updates.name || !updates.description || !updates.category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if arrays have matching lengths
    if (
      updates.videos?.length !== updates.thumbnails?.length ||
      updates.videos?.length !== updates.titles?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Videos, thumbnails, and titles must have matching lengths",
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, session }
    ).populate("teacherId", "firstName lastName email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, res);
  } finally {
    session.endSession();
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove course from teacher's courses array
    await Teacher.findByIdAndUpdate(
      course.teacherId,
      { $pull: { courses: id } },
      { session }
    );

    await Course.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, res);
  } finally {
    session.endSession();
  }
};

// Get Courses by Teacher
const getCoursesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const courses = await Course.find({ teacherId }).populate(
      "enrolledStudents",
      "firstName lastName email"
    );

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: {
        teacher: {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
        },
        courses,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// Enroll Student in Course
const enrollStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.body;
    const { id: courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }

    course.enrolledStudents.push(studentId);
    await course.save({ session });

    // Add course to student's enrolled courses (if you have this field in your student model)
    await Student.findByIdAndUpdate(
      studentId,
      { $push: { enrolledCourses: courseId } },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      data: course,
    });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, res);
  } finally {
    session.endSession();
  }
};

// Get Teacher Course Statistics
const getTeacherCourseStats = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    const stats = await Course.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalStudents: { $sum: { $size: "$enrolledStudents" } },
          averageStudentsPerCourse: { $avg: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data:
        stats.length > 0
          ? stats[0]
          : {
              totalCourses: 0,
              totalStudents: 0,
              averageStudentsPerCourse: 0,
            },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  enrollStudent,
  getTeacherCourseStats,
};
