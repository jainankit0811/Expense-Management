import bcrypt from "bcryptjs";
import crypto from "crypto";
import user from "../models/user.model.js";
import { sendOtpMail as sendEmail } from "../utils/sendEmail.js";
import generateToken from "../utils/token.js";

const signUp = async (req, res) => {
    try {
        // Logic for user sign-up
        const { fullName, email, password, mobileNumber, role } = req.body;
        const User = await user.findOne({ email })
        if (User) {
            return res.status(400).send("User already exists")
        }
        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long")
        }
        if (mobileNumber.length < 10) {
            return res.status(400).send("Invalid mobile number")
        }
        if (!['user', 'owner', 'delivery'].includes(role)) {
            return res.status(400).send("Invalid role")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ fullName, email, password: hashedPassword, mobileNumber, role });
        const token = await generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 30 days
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", email });

    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const login = async (req, res) => {
    try {
        // Logic for user sign-in
        const { email, password } = req.body;
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(400).send("User does not exist");
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const token = await generateToken(User._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.status(200).json({ message: "User signed in successfully", email });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const signOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS 
            sameSite: "strict",
        });
        res.status(200).json({ message: "User SignOut successfully" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const sendOtpMail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send("Email is required");
        }
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(400).send("User does not exist");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        User.resetOtp = otp;
        User.otpExpire = Date.now() + 5 * 60 * 1000;
        User.isOtpVerified = false
        await User.save();

        await sendEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email", email });
    }
    catch (error) {
        res.status(500).send("Server Error");
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(400).send("User does not exist");
        }
        if (User.resetOtp !== otp || User.otpExpire < Date.now()) {
            return res.status(400).send("Invalid or expired OTP");
        }
        User.isOtpVerified = true;
        User.resetOtp = null;
        User.otpExpire = null;
        await User.save();
        res.status(200).json({ message: "OTP verified successfully", email });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, newpassword } = req.body;
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(400).send("User does not exist");
        }
        if (!foundUser.isOtpVerified) {
            return res.status(400).send("OTP not verified");
        }
        if (newpassword.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        foundUser.password = hashedPassword;

        foundUser.isOtpVerified = false;
        await foundUser.save();
        res.status(200).json({ message: "Password reset successfully", email });

    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, role } = req.body;
        let User = await user.findOne({ email });
        if (!User) {
            if (!mobileNumber || mobileNumber.length < 10) {
                return res.status(400).send("Valid mobile number is required for new users");
            }
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            User = new user({ fullName, email, password: hashedPassword, mobileNumber, role });
            await User.save();
        }
        const token = await generateToken(User._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.status(200).json({ message: "User signed in successfully", email });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export { googleAuth, login, resetPassword, sendOtpMail, signOut, signUp, verifyOTP };

