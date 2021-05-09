
const User = require("../models/user");
const jwt = require("jsonwebtoken");



const auth = async (req, res, next) => {
   
    const secretKey = "thisismytokensecret";
    try{
      // next();
       const token = req.header("Authorization").replace("Bearer ", "");
       const decoded = jwt.verify(token, secretKey);

       const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

       console.log(token);
       if(!user)
       throw new Error();
       
       req.token = token;
       req.user = user; 
       
       next();
    }
    catch(e)
    {
        res.status(401).send("user is not authenticated!");
    }

}

module.exports = auth;