const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    videos: {
        type: Array,
        required: true,
    },
    thumbnails: {
        type: Array,
        required: true
    },
    teacherId: {
        type: String,
        required: true,
    },
    enrolledStudents: {
        type: Array,
        required: false,
    }
});

module.exports = mongoose.model('Course', courseSchema);