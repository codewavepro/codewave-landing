'use client';

import {useEffect} from 'react';
import {useLocaleStore} from '@/store/useLocaleStore';
import {type Dictionary} from '@/lib/dictionary';
import {type Locale} from '@/config/i18n-config';
import PrivacyPolicy from '@/components/Legal/PrivacyPolicy/PrivacyPolicy';
import styles from './PrivacyPolicyClient.module.scss';

interface PrivacyPolicyClientProps {
    dictionary: Dictionary;
    lang: Locale;
}

export default function PrivacyPolicyClient({lang}: PrivacyPolicyClientProps) {
    const {setLocale} = useLocaleStore();

    useEffect(() => {
        setLocale(lang);
    }, [lang, setLocale]);

    return (
        <div className={styles.sections}>
            <PrivacyPolicy />
        </div>
    );
}
