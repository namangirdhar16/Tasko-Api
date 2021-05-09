const mongoose = require('mongoose');
const validator = require('validator');
require("dotenv").config();


mongoose.connect(process.env.mongoosePort, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});


// const user1 = new User({
//     name: "naman",
//     email: "namangirdhar16@gmail.com",
//     password: 1335343
// })

// user1.save().then(()=>{
//    console.log(user1);
// }).catch((err)=>{
//     console.log(err);
// })


// try {

//  const deleteUser = async () => {
   
//    const deletedUser =  await User.deleteOne({
//         _id: "6083b3750b44c565c08aeb9b"
//     })
//     console.log(deletedUser);

//  }
  
//  deleteUser();

// }
// catch (err) {
//     console.log(err);
// }
