'use client'

import Link from 'next/link';
import { useLocaleStore } from "@/store/useLocaleStore";
import LayoutContainer from '@/components/common/Container/SectionContainer';
import useDictionary from '@/hooks/useDictionary';
import styles from './NotFoundClient.module.scss';

export default function NotFoundClient() {
    const { locale } = useLocaleStore();
    const { dictionary, loading } = useDictionary();

    if (loading || !dictionary) return null;

    return (
        <section className={styles.notFound}>
            <LayoutContainer>
                <div className={styles.content}>
                    <h1>{dictionary.notFound.info.title}</h1>
                    <p>{dictionary.notFound.info.description}</p>
                    <Link href={`/${locale}`} className={styles.backButton}>
                        {dictionary.notFound.info.backButton}
                    </Link>
                </div>
            </LayoutContainer>
        </section>
    );
}