const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
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
    },
    nic: {
        type: String,
        required: true,
    },
    courses: {
        type: Array,
        required: false,
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);