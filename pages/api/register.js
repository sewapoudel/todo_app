// pages/api/register.js
import { connectToDB } from "../../utils/connectdb";
import User from "../../models/userModel";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        await connectToDB();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            await newUser.save();
            return res.status(201).json({ msg: "User registered successfully!" });
        } catch (error) {
            console.error("Registration Error:", error);
            return res.status(500).json({ msg: error.message || "Registration failed." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
