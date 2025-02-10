const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Course name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
    trim: true,
  },
  videos: [
    {
      type: String,
      required: [true, "At least one video URL is required"],
    },
  ],
  thumbnails: [
    {
      type: String,
      required: [true, "At least one thumbnail URL is required"],
    },
  ],
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: [true, "Teacher ID is required"],
  },
  enrolledStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  category: {
    type: String,
    required: [true, "Course category is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
