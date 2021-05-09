const mongoose = require('mongoose');
const validator = require('validator');
require("dotenv").config();


mongoose.connect(`mongodb+srv://tasko:${process.env.PASSWORD}@cluster0.27cvt.mongodb.net/tasko-api`, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});

