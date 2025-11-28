import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
    },
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long'],
    },
    profilePic: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;    