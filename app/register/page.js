"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from './Register.module.css';

const Register = () => {
    const [info, setInfo] = useState({ username: "", email: "", password: "" });
    const [feedback, setFeedback] = useState({ type: "", msg: "" });
    const router = useRouter();

    const handleInput = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(info),
            });

            const data = await response.json();
            if (response.ok) {
                setFeedback({ type: "success", msg: data.msg });
                router.push("/login");
            } else {
                setFeedback({ type: "error", msg: data.msg });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Registration failed. Please try again." });
        }
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className={styles.homeLink}>
                    ← Home
                </Link>
                <h1 className={styles.headerLogo}>TaskMaster</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Create Your Account</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>Username</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={info.username}
                                onChange={handleInput}
                                required
                                className={styles.input}
                                placeholder="Choose a username"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={info.email}
                                onChange={handleInput}
                                required
                                className={styles.input}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={info.password}
                                onChange={handleInput}
                                required
                                className={styles.input}
                                placeholder="Create a password"
                            />
                        </div>
                        {feedback.msg && (
                            <p className={feedback.type === "error" ? styles.error : styles.success}>
                                {feedback.msg}
                            </p>
                        )}
                        <button type="submit" className={styles.button}>Sign Up</button>
                    </form>
                    <p className={styles.loginPrompt}>
                        Already have an account? <Link href="/login" className={styles.loginLink}>Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;