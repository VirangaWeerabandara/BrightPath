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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Course', courseSchema);