const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  role: {
    type: String,
    default: "teacher",
    required: true,
  },
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
  },
});

teacherSchema.statics.signup = async function (
  firstName,
  lastName,
  nic,
  email,
  password
) {
  if (!email || !password || !firstName || !lastName || !nic) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const teacher = await this.create({
    firstName,
    lastName,
    nic,
    email,
    password: hash,
  });

  return teacher;
};

teacherSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const teacher = await this.findOne({ email });

  if (!teacher) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, teacher.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return teacher;
};

module.exports = mongoose.model("Teacher", teacherSchema);
