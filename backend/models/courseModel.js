const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  url: {
    type: String,
    required: [true, "Video URL is required"],
  },
  title: {
    type: String,
    required: [true, "Video title is required"],
    trim: true,
  },
  public_id: {
    type: String,
    required: [true, "Cloudinary public ID is required"],
  },
});

const thumbnailSchema = new Schema({
  url: {
    type: String,
    required: [true, "Thumbnail URL is required"],
  },
  public_id: {
    type: String,
    required: [true, "Cloudinary public ID is required"],
  },
});

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
  videos: [videoSchema],
  thumbnails: [thumbnailSchema],
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
