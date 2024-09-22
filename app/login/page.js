"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from './Login.module.css'; // Ensure this path is correct

const Login = () => {
    const [info, setInfo] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleInput = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: false,
            email: info.email,
            password: info.password,
        });

        if (result?.error) {
            setErrorMessage(result.error);
        } else {
            router.push("/task"); // Redirect to task page on successful login
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
                    <h2 className={styles.title}>Welcome Back</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
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
                                placeholder="Enter your password"
                            />
                        </div>
                        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                        <button type="submit" className={styles.button}>Log In</button>
                    </form>
                    <p className={styles.signupPrompt}>
                        Don't have an account? <Link href="/register" className={styles.signupLink}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
