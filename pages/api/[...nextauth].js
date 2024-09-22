import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../utils/connectdb";
import User from "../../models/userModel";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB(); // Ensure DB connection
          console.log("Credentials:", credentials); // Log for debugging

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          const isCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isCorrect) {
            throw new Error("Invalid password.");
          }

          return user;
        } catch (error) {
          console.error("Error during authentication:", error); // Log for debugging
          // You can optionally return null here to indicate failed authentication
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
    error: "/error", // Custom error page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl; // Redirect to appropriate URL
    },
  },
});