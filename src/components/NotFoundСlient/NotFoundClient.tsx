'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useLocaleStore} from "@/store/useLocaleStore";
import useDictionary from "@/hooks/useDictionary";
import SectionContainer from "@/components/common/Container/SectionContainer";
import styles from './NotFoundClient.module.scss';

export default function NotFoundClient() {
    const {locale} = useLocaleStore();
    const {loading, dictionary} = useDictionary();
    const [particles, setParticles] = useState<Array<{ id: number, style: React.CSSProperties }>>([]);

    useEffect(() => {
        const particlesArray = Array.from({length: 20}, (_, i) => ({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                opacity: Math.random() * 0.3 + 0.1,
            },
        }));
        setParticles(particlesArray);
    }, []);

    if (loading || !dictionary) return null;

    const t = dictionary.notFound.info

    return (
        <section className={styles.notFound}>
            <SectionContainer>
                <div className={styles.content}>
                    <h1>404</h1>
                    <p>{t.description}</p>
                    <Link href={`/${locale}`} className={styles.backButton}>
                        {t.backButton}
                    </Link>
                </div>

                <div className={styles.particles}>
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className={styles.particle}
                            style={particle.style}
                        />
                    ))}
                </div>
            </SectionContainer>
        </section>
    );
}