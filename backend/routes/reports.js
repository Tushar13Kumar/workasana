const router = require("express").Router();
const verifyToken = require("../middleware/auth")
const Task = require("../models/Task")

router.get("/last-week" , verifyToken , async(req , res) => {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() -7)

    const tasks = await Task.find({
        status: "Completed",
        updatedAt: {$gte: lastWeek}
    })
    .populate("project" , "name")
    .populate("team" , "name")

    res.status(202).json(tasks)
})


router.get("/pending" , verifyToken , async(req , res) => {
    const tasks = await Task.find({status:{$ne: "Completed"}})

    const totalDays = tasks.reduce((sum , task) => {
        return sum + task.timeToComplete
    },0)

    res.status(201)
    .json({totalPendingdays: totalDays , tasks})
})


router.get("/completed" , verifyToken , async(req , res ) => {
    const tasks = await Task.find({status: "Completed"})
    .populate("team" , "name")
    .populate("project" , "name")
    .populate("owner" , "name")

    res.status(201).json(tasks)
})
module.exports = router