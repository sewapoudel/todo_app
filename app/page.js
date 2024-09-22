// app/page.js
"use client";
import { useRouter } from 'next/navigation';
import styles from './Homepage.module.css';

const Home = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.logo}>TaskMaster</h1>
                <nav className={styles.nav}>
                    <button onClick={() => router.push('/login')} className={styles.navButton}>Log In</button>
                    <button onClick={() => router.push('/register')} className={styles.navButton}>Sign Up</button>
                </nav>
            </header>
            <main className={styles.main}>
                <h2 className={styles.tagline}>Elevate Your Productivity</h2>
                <p className={styles.description}>
                    TaskMaster empowers you to conquer your goals, meet deadlines, and streamline your daily tasks with ease.
                    Join the productivity revolution and transform the way you work and live.
                </p>
                <button onClick={() => router.push('/register')} className={styles.ctaButton}>
                    Start Your Journey
                </button>
            </main>
        </div>
    );
};

export default Home;