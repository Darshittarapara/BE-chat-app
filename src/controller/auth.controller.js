import cloudinary from "../lib/cloundary.js";
import APIError from "../lib/Error.js";
import { hashPassword, generateToken, comparePassword } from "../lib/helper.js";
import User from "../model/user.model.js";
import fs from 'fs'

export const signup = async (req, res, next) => {
    // Handle user registration
    //Genearate hashed password
    console.log('running')
    try {

        const { email, password } = req.body;
        const isUserFound = await User.findOne({ email });
        if (isUserFound) {
            throw new APIError('User already exists', 400);
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
        if (newUser) {
            generateToken(newUser, res);
            await newUser.save();
            res.status(201).json({
                status: true,
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: "User registered successfully",
            });
        } else {
            res.status(500).json({ message: "Something went wrong" });
        }
    } catch (error) {
        console.error('Error during signup:', error.message);
        next(error);
    }
}
export const login = async (req, res, next) => {
    try {
        //Check user credentials valid
        const { email, password } = req.body;

        const isUserFound = await User.findOne({ email });
        if (!isUserFound) {
            throw new APIError('User not found', 400);
        }
        const isPasswordMatch = await comparePassword(password, isUserFound.password);
        if (!isPasswordMatch) {
            throw new APIError('Invalid credentials', 400);
        }
        generateToken(isUserFound, res);
        res.status(200).json({
            status: true,
            _id: isUserFound._id,
            fullName: isUserFound.fullName,
            email: isUserFound.email,
            profilePic: isUserFound.profilePic,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        next(error);
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({
            status: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error('Error during logout:', error.message);
        next(error);
    }
}

export const updateProfilePic = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(req.file, 'test')
        const url = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pics',
            crop: 'scale',
        });
        fs.unlinkSync(req.file.path);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: url.secure_url },
            { new: true }
        );
        res.status(200).json({
            status: true,
            user: updatedUser,
            message: "Profile picture updated successfully",
        });
    } catch (error) {
        console.error('Error updating profile picture:', error.message);
        next(error);
    }
}

export const checkAuth = async (req, res, next) => {
    try {
        res.status(200).json({
            status: true,
            user: req.user,
            message: "User is authenticated",
        });
    } catch (error) {
        console.error('Error during auth check:', error.message);
        next(error);
    }
}