const express = require("express");

const taskRouter = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth.js");



taskRouter.get('/tasks', auth, async (req, res) => {
  
    console.log(req.query.completed);
    try{
        
        const match = {};
        const sort = {};
        if(req.query.completed)
        match.completed = req.query.completed === "true" ? true : false;

        if(req.query.sortBy)
        {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "inc" ? 1 : -1;
        }
        
        //res.status(200).send(tasks);
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                skip: parseInt(req.query.skip),
                limit: parseInt(req.query.limit),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } 
    catch(e)
    {
        res.status(404).send(e); 
    }

})


taskRouter.post('/tasks', auth, async (req, res) => {
    console.log(req.body);
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try{
       await task.save();
       res.status(200).send(task);
    }
    catch(e)
    {
       res.status(404).send(task);
    }

})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        const task = await Task.findOne({ _id , author: req.user._id});
        if(!task)
        res.status(404).send("task not found");
        res.staus(404).send(task);

    }
    catch(e)
    {
        res.staus(500).send(e);
    }

})

taskRouter.patch("/tasks/:id", auth, async (req, res) => {

    const _id = req.params.id;
    const allowedUpdates = ["description", "completed"];
    const updates = Object.keys(req.body);

    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if(!isValid)
    res.status(404).send("invalid updates");

    try{
        const task = await Task.findOne({ _id , author: req.user._id });

        updates.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();
        if(!task)
        res.status(404).send("task not found");
        res.status(201).send(task);

    }
    catch(e)
    {
        res.status(404).send(e);
    }

})

// endpoint for deleting the task

taskRouter.delete("/tasks/:id", auth, async (req,res) => {
    const _id = req.params.id;

    try{
        const task = await Task.findOneAndDelete({ _id , author: req.user._id });

        if(!task)
        res.status(404).send("task not found");
        res.status(200).send(task);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

module.exports = taskRouter;