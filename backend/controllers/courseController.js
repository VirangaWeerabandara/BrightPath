const Course = require('../models/courseModel');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');

// Helper function to handle errors
const handleError = (error, res) => {
    console.error('Error:', error);
    return res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: error.message
    });
};

const createCourse = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, videos, thumbnails, teacherId } = req.body;

        if (!name || !videos || !thumbnails || !teacherId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        const newCourse = new Course({
            name,
            videos,
            thumbnails,
            teacherId,
            enrolledStudents: []
        });

        const savedCourse = await newCourse.save({ session });

        await Teacher.findByIdAndUpdate(
            teacherId,
            { $push: { courses: savedCourse._id } },
            { session }
        );

        await session.commitTransaction();
        
        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: savedCourse
        });
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, res);
    } finally {
        session.endSession();
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        return handleError(error, res);
    }
}

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const teacher = await Teacher.findById(course.teacherId, 'firstName lastName email');

        return res.status(200).json({
            success: true,
            data: {
                course,
                teacher
            }
        });
    } catch (error) {
        return handleError(error, res);
    }
}

updateCourse = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updates = req.body;
        const courseId = req.params.id;

        if (updates.teacherId) {
            const oldCourse = await Course.findById(courseId);
            if (!oldCourse) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            await Teacher.findByIdAndUpdate(
                oldCourse.teacherId,
                { $pull: { courses: courseId } },
                { session }
            );

            const newTeacher = await Teacher.findById(updates.teacherId);
            if (!newTeacher) {
                return res.status(404).json({
                    success: false,
                    message: 'New teacher not found'
                });
            }

            await Teacher.findByIdAndUpdate(
                updates.teacherId,
                { $push: { courses: courseId } },
                { session }
            );
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { $set: updates },
            { new: true, runValidators: true, session }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, res);
    } finally {
        session.endSession();
    }
}

const deleteCourse = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await Teacher.findByIdAndUpdate(
            course.teacherId,
            { $pull: { courses: courseId } },
            { session }
        );

        await Course.findByIdAndDelete(courseId).session(session);

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, res);
    } finally {
        session.endSession();
    }
}

const getCoursesByTeacher = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        const courses = await Course.find({ teacherId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: {
                teacher: {
                    firstName: teacher.firstName,
                    lastName: teacher.lastName,
                    email: teacher.email
                },
                courses
            }
        });
    } catch (error) {
        return handleError(error, res);
    }
}

const enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.enrolledStudents.includes(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Student already enrolled in this course'
            });
        }

        course.enrolledStudents.push(studentId);
        await course.save();

        return res.status(200).json({
            success: true,
            message: 'Student enrolled successfully',
            data: course
        });
    } catch (error) {
        return handleError(error, res);
    }
}

const getTeacherCourseStats = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        const stats = await Course.aggregate([
            { $match: { teacherId } },
            { 
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    totalStudents: { 
                        $sum: { $size: "$enrolledStudents" } 
                    },
                    averageStudentsPerCourse: { 
                        $avg: { $size: "$enrolledStudents" } 
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalCourses: 0,
                    totalStudents: 0,
                    averageStudentsPerCourse: 0
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        return handleError(error, res);
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCoursesByTeacher,
    enrollStudent,
    getTeacherCourseStats
};