const jwt = require("jsonwebtoken")
const verifyToken = (req,res , next) => {
    const token = req.headers["authorization"];

    if(!token){
        return res.status(401).json({message: "No token is provided"})
    }
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        res.status(401).json({message: "Invalid Token"})
    }
}

module.exports = verifyToken