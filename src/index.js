const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./db/mongoose.js");
require("dotenv").config();
const port = process.env.PORT || 3000;


const User = require("./models/user.js");
const Task = require("./models/task.js");

const userRouter = require("./routers/user-routes");
const taskRouter = require("./routers/task-routes");

app.use(userRouter);
app.use(taskRouter);
app.use(express.json());

 
const multer = require("multer");
const upload = multer({
    dest: "upload_images"
});



app.listen(port, () => {
    console.log('Server is up and running on part ' + port);
})

