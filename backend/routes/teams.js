const router = require("express").Router()
const Team = require("../models/Team")
const verifyToken = require("../middleware/auth")

router.get("/" , verifyToken , async(req , res) => {
    const teams = await Team.find()

    res.status(200).json(teams)
})

router.post("/" , verifyToken , async (req ,res) => {
    const {name , description} = req.body
    const existing = await Team.findOne({name})
    if(existing){
        return res.status(400).json({message: "Team is alredy exist"})
    }

    const team = new Team({name , description});
    await team.save();
    res.status(200).json(team)
})

module.exports = router