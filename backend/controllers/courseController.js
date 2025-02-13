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
    const { name, description, videos, thumbnails, teacherId, category } =
      req.body;

    // Validate video structure
    if (
      !Array.isArray(videos) ||
      videos.some((video) => !video.url || !video.title || !video.public_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Videos must include url, title, and public_id",
      });
    }

    // Validate thumbnail structure
    if (
      !Array.isArray(thumbnails) ||
      thumbnails.some((thumb) => !thumb.url || !thumb.public_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Thumbnails must include url and public_id",
      });
    }

    // Create new course
    const newCourse = new Course({
      name,
      description,
      videos: videos.map((video) => ({
        url: video.url,
        title: video.title,
        public_id: video.public_id,
      })),
      thumbnails: thumbnails.map((thumb) => ({
        url: thumb.url,
        public_id: thumb.public_id,
      })),
      teacherId,
      category,
      enrolledStudents: [],
    });

    // Save the course
    const savedCourse = await newCourse.save({ session });

    // Update teacher's courses array
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { courses: savedCourse._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    return handleError(error, res);
  } finally {
    // End session
    session.endSession();
  }
};

// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacherId", "firstName lastName email")
      .select("name description category thumbnails videos.title teacherId");

    const formattedCourses = courses.map((course) => ({
      ...course.toObject(),
      thumbnails: course.thumbnails.map((thumbnail) => thumbnail.url),
    }));

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: formattedCourses,
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

    // Validate video structure if videos are being updated
    if (updates.videos) {
      if (
        !Array.isArray(updates.videos) ||
        updates.videos.some(
          (video) => !video.url || !video.title || !video.public_id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Videos must include url, title, and public_id",
        });
      }
    }

    // Validate thumbnail structure if thumbnails are being updated
    if (updates.thumbnails) {
      if (
        !Array.isArray(updates.thumbnails) ||
        updates.thumbnails.some((thumb) => !thumb.url || !thumb.public_id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Thumbnails must include url and public_id",
        });
      }
    }

    // ... rest of the function
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, res);
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

const getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id; // Get logged-in student's ID

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Find course and populate teacher details
    const course = await Course.findById(courseId)
      .populate("teacherId", "firstName lastName")
      .select("name description category videos thumbnails teacherId");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is enrolled in the course
    const student = await Student.findById(studentId);
    if (!student.courses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Please enroll in the course first.",
      });
    }

    // Transform video URLs for better streaming
    const transformedVideos = course.videos.map((video) => ({
      ...video.toObject(),
      url: `${video.url.replace("/upload/", "/upload/q_auto,f_auto,c_limit/")}`,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        videos: transformedVideos,
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
  getCourseContent,
};
