const express = require("express");
const userRouter = new express.Router();
const User = require("../models/user");
const multer = require("multer");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancellationEmail }   = require("../emails/account");

userRouter.use(express.json());

userRouter.use(express.urlencoded({
    extended: true
}));

userRouter.post('/users', async (req, res) => {

    const user = new User(req.body);
    try{
        const token = await user.getAuthToken();
        sendWelcomeEmail(req.body.name, req.body.email);
        await user.save();
        res.status(201).send({user, token});
    }
    catch(e)
    {
        res.status(404).send(e);
    }
   
})

userRouter.post("/users/login", async (req, res) => {
  // console.log(req.body.email,req.body.password);
    try{
        
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken();
        //console.log(token);
       res.status(200).send({ user, token});
    
    }
    catch(e)
    {
    
       res.status(404).send(e.message);
    }
});

userRouter.post("/users/logout", auth, async(req, res) => {
    
    try{
      
//      console.log(req.user.tokens.length);
       req.user.tokens = req.user.tokens.filter((token) => {
            if(req.token != token);
            {
  //              console.log(token._id);
                return req.token === token;
            }
       })
       await req.user.save();
       res.send();
    }
    catch(e)
    {
      res.status(500).send(e.message);
    }
})
    

userRouter.post("/users/logoutAll", auth, async (req, res) => {
    try{
       req.user.tokens = [];
       await req.user.save();
       res.send();
    }
    catch(e)
    {
       res.status(401).send(e);
    }
})

const valid = (file) => {
    if(file.endsWith("pdf") || file.endsWith("doc") || file.endsWith("docx"))
    return false;
    return true;
}
const avatar = multer({
    // dest: "avatars",
    limitSize: 1000000,
    fileFilter(req, file, cb)
    {
        if(valid(file.originalname))
        return cb(undefined, true);
        else
        return cb(new Error("uploaded files must be of image format"));
    }
});

userRouter.post("/users/me/avatar", auth, avatar.single("avatar"), async (req, res) => {

    req.user.avatar = await sharp(req.file.buffer).resize({height: 180, width: 180}).png().toBuffer();
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({error: err.message});
})

userRouter.get("/users/:id/avatar", auth, async(req, res) => {
    
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        
        if(!user || !user.avatar)
        {
           throw new Error();
        }
        res.set("Content-Type", "image/jpeg");
        res.send(user.avatar);
    }
    catch(e)
    {
        res.status(404).send();
    }

})

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  
    try{
      
         req.user.avatar = undefined;
         await req.user.save(); 
 
       res.status(200).send();
    }
    catch(e)
    {
       res.status(404).send({error: e.message});
    }
})

userRouter.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})


userRouter.get('/users/:id', auth, async (req, res) => {

    const _id = req.params.id;
    
    try{
       const user = await User.findOne({ _id });
       if(!user)
       res.status(404).send("user not found!");
       res.status(200).send(user);

    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

userRouter.patch("/users/me" , auth, async (req, res) => {
    
    const _id = req.user._id;
    const allowedUpdates = ['name', 'email', 'password'];
    const updates = Object.keys(req.body);
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    
    if(!isValid)
    res.status(404).send("invalid updates");
    
    try {
        
        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save();
     
        if(!user)
        res.status(404).send("user does not exist");
        res.status(200).send(user);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})



userRouter.delete("/users/me", auth, async (req, res) => {
    
    const _id = req.user._id;

    try{
         await User.findByIdAndDelete({ _id });
         sendCancellationEmail(req.user.name, req.user.email);
         const user = req.user;
         res.status(200).send(user);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})


module.exports = userRouter;