import User from "../models/User.js";
import bcrypt from 'bcrypt';
import Resume from "../models/Resume.js";
import { generateJWTToken,generateVerificationToken } from "../utils/generateToken.js";
import { sendMail } from "../configs/nodeMailer.js";

//controller for user registration
//POST: //api/users/register
export const registerUser = async(req,res) => {
    try{
        const {name,email,password,confirmPassword} = req.body;

        //check if requisred fields are present
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                message:"Missing Required Fields"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                message:"Passwords do not match"
            });
        }

        //check if user already exists
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            name, email, password: hashedPassword
        });

        const verificationToken = generateVerificationToken();
        newUser.verificationToken = verificationToken;
        sendMail(
            newUser.email,
            "Verify your email",
            `Your verification code is ${verificationToken}`
        );
        await newUser.save();

        // remove password before sending response
        const userObj = newUser.toObject();
        delete userObj.password;

        //return success message
        return res.status(201).json({
            message:"User registered successfully",
            user: userObj,
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for user login
//POST: //api/users/login
export const loginUser = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Missing required fields"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid details"
            });
        }

        if(!user.comparePassword(password)){
            return res.status(400).json({
                message:"Invalid details"
            });
        }

        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        sendMail(
            user.email,
            "Verify your email",
            `Your verification code is ${verificationToken}`
        );        
        await user.save();

        // remove password before sending response
        const userObj = user.toObject();
        delete userObj.password;

        //return success message
        return res.status(201).json({
            message:"User logged in successfully",
            user: userObj,            
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for verifying user email
//POST: /api/users/verify-email
export const verifyEmail = async (req,res) => {
    try{
        const {email,verificationToken} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid email"
            });
        }

        if(user.verificationToken !== verificationToken){
            return res.status(400).json({
                message:"Invalid verification token"
            });
        }

        user.verificationToken = null;
        await user.save();

        // remove password before sending response
        const userObj = user.toObject();
        delete userObj.password;

        //generate authentication token
        const token = await generateJWTToken(user._id);

        //return success message
        return res.status(201).json({
            message:"Email verified successfully",
            user: userObj,
            token
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for resending verification token
//POST: /api/users/resend-verification
export const resendVerification = async (req,res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid email"
            });
        }
        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        sendMail(
            user.email,
            "Verify your email",
            `Your verification code is ${verificationToken}`
        );        
        await user.save();
        return res.status(200).json({
            message:"Verification code resent successfully"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for getting user by id
//POST: //api/users/data
export const getUserById = async(req,res) => {
    try{
        const userId = req.userId;

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"Invalid User"
            });
        }

        // remove password before sending response
        const userObj = user.toObject();
        delete userObj.password;

        //return success message
        return res.status(201).json({
            user: userObj
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for getting user resumes
//GET: /api/users/resume
export const getUserResumes = async (req,res) => {
    try{
        const userId = req.userId;

        //return user resumes
        const resumes = await Resume.find({userId});
        return res.status(200).json({resumes});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}