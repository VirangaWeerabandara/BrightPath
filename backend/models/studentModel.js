const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    role: {
      type: String,
      default: "student",
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
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

studentSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  if (!email || !password || !firstName || !lastName) {
    throw Error("All fields must be filled");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const student = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  return student;
};

studentSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Email and password are required");
  }

  const student = await this.findOne({ email });

  if (!student) {
    throw Error("User does not exist");
  }

  const match = await bcrypt.compare(password, student.password);

  if (!match) {
    throw Error("Invalid password");
  }

  return student;
};

module.exports = mongoose.model("Student", studentSchema);
