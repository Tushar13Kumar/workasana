const router = require("express").Router();

const Project = require("../models/Project")

const verifyToken = require("../middleware/auth");

router.get("/" , verifyToken , async(req , res) => {
    const projects =  await Project.find()
    res.status(200).json(projects)
})

router.post("/" , verifyToken , async (req , res) => {
    const {name , description} = req.body;

    const existing = await Project.findOne({name});
    if(existing){
        return res.status(400).json({message: "project is alredy taken"})
    }
    const project = new Project({name , description})
    await project.save();
    res.status(201).json(project);
})
module.exports = router;