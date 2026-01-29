import User from "../models/User.js";
import { generateJWTToken, generateVerificationToken } from "../utils/generateToken.js";
import { sendMail } from "../configs/nodeMailer.js";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//controller for Google OAuth login
//POST: /api/auth/google
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Google token is required"
            });
        }

        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { googleId }] });

        if (user) {
            // If user exists but doesn't have googleId, update it
            if (!user.googleId) {
                user.googleId = googleId;
                user.isEmailVerified = true;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                isEmailVerified: true
            });
        }

        // Generate JWT token
        const jwtToken = await generateJWTToken(user._id);

        // Return user and token
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            message: "Google login successful",
            user: userObj,
            token: jwtToken
        });
    } catch (err) {
        console.log("Google Auth Error:", err);
        return res.status(401).json({
            message: "Invalid Google token"
        });
    }
};
