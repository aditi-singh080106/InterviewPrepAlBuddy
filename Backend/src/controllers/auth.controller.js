const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
/**
 * 
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access public
 */

async function registerUserController(req,res){

    const {username,email,password}= req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username, email and password",
        });
    }
    else{
        const isUserAlreadyExists = await userModel.findOne({
            $or:[{ username } , { email }]
        })

        if(isUserAlreadyExists){
            /* isUserAlreadyExists.username == username */
            /* isUserAlreadyExists.email == email */
            return res.status(400).json({
                message:"Account already exists with this username or email address !"
            })
        }
        // this mean no user exists and we have to add this user in user db
        const hashPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            username,
            email,
            password:hashPassword,
        });

        // creating token for the user
        const token = jwt.sign({
            id:user._id,
            username:user.username
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    );
    // now this token is set on cookie
    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access public
 */

async function loginUserController(req,res){

    console.log("req.body:", req.body);

    const {email,password} = req.body;
    const user = await userModel.findOne({
        email
    });
     console.log("user found:", user); // null aaya toh email match nahi

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password!"
        });
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    console.log("password valid:", isPasswordValid); 
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password!"
        })
    }
    const token = jwt.sign({
        id:user._id,
        username:user.username
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
    )

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add token in blacklist
 * @access public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token;
    if(token){
        // blacklist
        await tokenBlacklistModel.create({token});
    }

    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out successfully !"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        message:"User details fetched successfully!",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};