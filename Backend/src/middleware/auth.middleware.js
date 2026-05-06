const jwt = require("jsonwebtoken");
const blacklistModel = require('../models/blacklist.model');

async function authUser(req,res,next){
    const token = req.cookies.token;
    // console.log("Cookie token:", token);        // token aa raha hai ya undefined?
    // console.log("All cookies:", req.cookies);
    if(!token){
        return res.status(401).json({
            message:"Token not provided!"
        });        
    }
        // blacklist check
    const isBlacklisted = await blacklistModel.findOne({ token });
    // console.log("Is blacklisted:", isBlacklisted);
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid. Please login again!"
        });
    }

    try{
        // token verification
        const decoded = jwt.verify(token,process.env.JWT_SECRET); 
        // console.log('decoded: ',decoded); 
        req.user = decoded
        next();
    }
    catch(err){
        console.log('JWT Error: ',err.message);
        return res.status(401).json({
            message:"Invalid token."
        })
    }
}

module.exports = {
    authUser
};