import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Must provide a username"],
        unique: true, // Ensures the username is unique
    },
    email: {
        type: String,
        required: [true, "Must provide an email"],
        unique: true, // Ensures the email is unique
    },
    password: {
        type: String,
        required: [true, "Must provide a password"],
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
