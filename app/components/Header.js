"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from './Header.module.css';

const Header = () => {
    const router = useRouter();

    return (
        <header className={styles.header}>
            <h1>To Do</h1>
            <div className={styles.navButtons}>
                <button onClick={() => router.push("/login")} className={styles.button}>Login</button>
                <button onClick={() => router.push("/register")} className={styles.button}>Register</button>
            </div>
        </header>
    );
};

export default Header;
