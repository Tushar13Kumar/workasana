const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/auth")

const User = require("../models/User")

router.post("/signup" , async(req , res) => {
    const {name , email , password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "Email is already taken"})
    }

    const hashpasword = await bcrypt.hash(password , 10);

    const newUser = new User({
        name, email , password: hashpasword
    })
    await newUser.save()

    res.status(200).json({message: "signup successfull"})
})

router.post("/login" , async(req , res) => {
    const {name , email , password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message: "invalid email and password"})
    }

    const isPasswordCorrect = await bcrypt.compare(password , user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "invalid email and password"})
    }
    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
    res.status(200).json({token: token , user:{id: user._id , name: name , email: email}})
})
router.get("/me" , verifyToken , async(req , res) => {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json(user)
})
module.exports = router;