'use client';

import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.scss';
import Link from 'next/link';

const COOKIE_KEY = 'cookie-consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(COOKIE_KEY);
        if (!saved) setVisible(true);
    }, []);

    const handleChoice = (value: 'accepted' | 'declined') => {
        localStorage.setItem(COOKIE_KEY, value);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={styles.banner}>
            <p className={styles.text}>
                We use cookies to improve your experience. Read our{' '}
                <Link href="/privacy" className={styles.link}>
                    Privacy Policy
                </Link>.
            </p>
            <div className={styles.buttons}>
                <button className={styles.accept} onClick={() => handleChoice('accepted')}>
                    Accept
                </button>
                <button className={styles.decline} onClick={() => handleChoice('declined')}>
                    Decline
                </button>
            </div>
        </div>
    );
}
