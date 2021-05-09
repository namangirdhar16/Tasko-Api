const express = require("express");
require("./db/mongoose.js");
const User = require("./models/user.js");
const Task = require("./models/task.js");
require("dotenv").config();

const multer = require("multer");
const upload = multer({
    dest: "upload_images"
});


const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
  
//     res.status(503).send("site is under maintainence, please come back later!");
// })
app.use(express.json());

const userRouter = require("./routers/user-routes");
const taskRouter = require("./routers/task-routes");

app.use(userRouter);
app.use(taskRouter);




// const middleware = (req, res, next) => {
//     throw new Error("from the middlware");
// }
// app.post("/upload", middleware, (req,res) => {
//     res.send();
// }, (err, req, res, next) => {
//     if(err)
//     {
//        res.status(400).send({error: err.message});
//     }
    
// })


// -----   hashing demo ------- 
// const hashFunction = async () => {
//     const password = "1233434isngin";
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);
//     const isEqual = await bcrypt.compare(password, hashedPassword);
//     console.log(isEqual);
// }

// hashFunction();

// const _id = "e9r9nngsgdi";
// const secretKey = "thisisjwtsecretkey";
// const tokenFunction = async () => {
//     const token = await jwt.sign({ _id }, secretKey);
//     console.log(token);
    
//         const data =  jwt.verify(token, secretKey ,(err, data) => {
//             if(err)
//             console.log(err);
//             else
//             console.log(data);
//         });
        
    
    
    
   
// }

// tokenFunction();

// const obj = {
//     name: "naman",
//     age: 19,
//     height: "5'9",
//     fact: "still finding somehting :)"
// }

// obj.toJSON = () => {
//     console.log("from toJSON");
//     return {};
// }

// console.log(JSON.stringify(obj));

// const check = async () => {
//     //   const task = await Task.findById("6090ec73ff342028401f42e8");
//     //   //console.log(task);
//     //   await task.populate("author").execPopulate();
//     //   console.log(task.populate());
      
//     const user = await User.findById("6090ea75a5f1c450886fa524");
//     await user.populate("tasks").execPopulate();
//     console.log(user.tasks);
// }
// check();


app.listen(port, () => {
    console.log('Server is up and running on part ' + port);
})

