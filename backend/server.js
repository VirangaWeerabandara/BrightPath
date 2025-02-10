const { uploadImage, uploadVideo } = require("./config/cloudinaryConfig.js");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

// Express app initialization
const app = express();

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

// CORS Configuration
const allowedOrigins = [process.env.CORS_ORIGIN];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Welcome Route
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to BrightPath Learning Platform" });
});

const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const uploadRoutes = require("./routes/upload"); // Add this line

// API Routes
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", courseRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong!",
  });
});

// Database Connection and Server Startup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB and listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
