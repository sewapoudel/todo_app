import { connectToDB } from "../../utils/connectdb"; // Adjust path as necessary
import User from "../../models/userModel"; // Adjust path as necessary
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        await connectToDB(); // Ensure the database connection is established

        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "No user found with this email." });
            }

            // Compare the password with the hashed password in the database
            const isCorrect = await bcrypt.compare(password, user.password);
            if (!isCorrect) {
                return res.status(401).json({ error: "Invalid password." });
            }

            // Remove the password field before returning user data for security
            const { password: _, ...userData } = user._doc;
            return res.status(200).json(userData); // Return the user data
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    // Handle other HTTP methods (if needed)
    return res.status(405).json({ error: "Method not allowed." });
}
