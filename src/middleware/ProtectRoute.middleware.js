import APIError from "../lib/Error.js";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const ProtectRoute =async (req, res, next) => {
    try {
        const token = req.cookies.token || '';
        
        if(!token) {
            throw new APIError('Unauthorized access, token missing', 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            throw new APIError('Unauthorized access, invalid token', 401);
        }
        const user = await User.findById(decoded.userId).select(['-password', '-__v']);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}