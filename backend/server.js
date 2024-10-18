const {uploadImage, uploadVideo, } = require("./config/cloudinaryConfig.js");

require('dotenv').config()


const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express()
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

const allowedOrigins = [process.env.CORS_ORIGIN];

app.use(cors({
  origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use((req, res, next) => {
    console.log(req.path, res.path)
    next()
})

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the MERN Stack App'});
})

app.post('/upload', (req, res) => {
    uploadImage(req.body.image) 
    .then(url => {
        res.send({url})
    })
    .catch(err => {
        res.status(500).send({err})
    })
})
app.post("/uploadMultipleImages", (req, res) => {
    uploadImage
      .uploadMultipleImages(req.body.images)
      .then((urls) => res.send(urls))
      .catch((err) => res.status(500).send(err));
  });

app.post("/uploadVideo", (req, res) => {
    uploadVideo(req.body.video)
    .then(url => {
        res.send({url})
    })
    .catch(err => {
        res.status(500).send({err})
    })
});

app.post("/uploadMultipleVideos", (req, res) => {
    uploadVideo
      .uploadMultipleVideos(req.body.videos)
      .then((urls) => res.send(urls))
      .catch((err) => res.status(500).send(err));
  });


// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB and listening on port', process.env.PORT);
        })
    })
    .catch(err => {
        console.log(err)
    })

