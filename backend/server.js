require('dotenv').config()

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the MERN Stack App'});
})

app.listen(process.env.PORT, () => {
  console.log('Server is running on port', process.env.PORT);   
})

