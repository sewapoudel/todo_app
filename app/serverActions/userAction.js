"use server";
import { signIn } from "next-auth/react";

export async function authenticate(prevState, formData) {
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (result?.error) {
            return { error: result.error === "CredentialsSignin" ? "Invalid credentials" : "Sign-in failed. Please try again." };
        }

        return { success: true };
    } catch (error) {
        return { error: "An unexpected error occurred. Please try again." };
    }
}
