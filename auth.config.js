import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../utils/connectdb"; // Adjust the path
import User from "../../models/userModel"; // Adjust the path
import bcrypt from "bcrypt";

const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email.");
                }

                const isCorrect = await bcrypt.compare(credentials.password, user.password);
                if (!isCorrect) {
                    throw new Error("Invalid password.");
                }

                return user; // Return the user object
            },
        }),
    ],
    pages: {
        signIn: "/login", // Custom sign-in page
        error: "/error", // Custom error page
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : `${baseUrl}/task`; // Redirect to task page on successful login
        },
    },
};

export default NextAuth(authConfig);
