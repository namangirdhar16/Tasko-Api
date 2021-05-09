const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Entered value is not a string");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.length<6)
            throw new Error("password length should be atleast 6");
            if (value.toLowerCase() == "password")
                throw new Error("Entered password cannot be equal to 'password'");
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true,
            timeStamps: true,
        },
        
    }],
    avatar: {
        type: Buffer
    }


},{
    timestamps: true,
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "author",
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;

}
userSchema.methods.getAuthToken = async function(){
      
    const user = this;
   
    const token = jwt.sign({ _id: user._id.toString()} , "thisismytokensecret");

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
    
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email} );

    if(!user)
    throw new Error("unable to login!");
    
    const isMatch = bcrypt.compare(password, user.password);

    if(!isMatch)
    throw new Error("unable to login");

    return user;

}


userSchema.pre('save', async function(next){
    
    const user = this;
    
     
    if(user.isModified("password"))
    {   
        console.log("hello");
        user.password = await bcrypt.hash(user.password, 8);
        console.log(user);
    }
    else
    {
        console.log("hello");
    }
   
    next();
})

userSchema.pre("remove", async function(next){
    const user = this;
    const tasks =  await Task.deleteMany({ author: user._id });
    console.log(tasks);
    next();
})

const User = new mongoose.model("User", userSchema);

module.exports = User;