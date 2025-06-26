'use client';

import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.scss';
import Button from "@/components/buttons/Button/Button";
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
                We use cookies to improve your experience. Read our {''}
                <Link href="/privacy-policy" className={styles.link}>
                    Privacy Policy
                </Link>.
            </p>
            <div className={styles.buttons}>
                <Button text="Accept" size="sm" color="light" ariaLabel="Accept" onClick={() => handleChoice('accepted')}  />
                <Button text="Decline" size="sm" color="dark" ariaLabel="Decline" onClick={() => handleChoice('declined')} />
            </div>
        </div>
    );
}
