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

// Image Upload Routes
app.post("/upload", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => {
      res.send({ url });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
});

app.post("/uploadMultipleImages", (req, res) => {
  uploadImage
    .uploadMultipleImages(req.body.images)
    .then((urls) => res.send(urls))
    .catch((err) => res.status(500).send(err));
});

// Video Upload Routes
app.post("/uploadVideo", (req, res) => {
  uploadVideo(req.body.video)
    .then((url) => {
      res.send({ url });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
});

app.post("/uploadMultipleVideos", (req, res) => {
  uploadVideo
    .uploadMultipleVideos(req.body.videos)
    .then((urls) => res.send(urls))
    .catch((err) => res.status(500).send(err));
});

// Route Imports
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course"); // Add this line

// API Routes
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", courseRoutes);

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
