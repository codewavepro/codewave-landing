'use client';

import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.scss';
import useDictionary from "@/hooks/useDictionary";
import Button from "@/components/buttons/Button/Button";
import Link from 'next/link';

const COOKIE_KEY = 'cookie-consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const { loading, dictionary } = useDictionary();

    useEffect(() => {
        const saved = localStorage.getItem(COOKIE_KEY);
        if (!saved) setVisible(true);
    }, []);

    const handleChoice = (value: 'accepted' | 'declined') => {
        localStorage.setItem(COOKIE_KEY, value);
        setVisible(false);
    };

    if (loading || !visible || !dictionary) return null;

    const t = dictionary.cookieBanner;

    return (
        <div className={styles.banner}>
            <p>
                {t.text}{" "}
                <Link href="/privacy-policy">
                    {t.privacyPolicy}
                </Link>.
            </p>
            <p>
                {t.description}
            </p>
            <div className={styles.buttons}>
                <Button
                    text={t.acceptButton}
                    size="sm"
                    color="light"
                    ariaLabel="Accept"
                    onClick={() => handleChoice('accepted')}
                />
                <Button
                    text={t.declineButton}
                    size="sm"
                    color="dark"
                    ariaLabel="Decline"
                    onClick={() => handleChoice('declined')}
                />
            </div>
        </div>
    );
}