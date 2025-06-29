'use client';

import {useEffect} from 'react';
import {useLocaleStore} from '@/store/useLocaleStore';
import {type Dictionary} from '@/lib/dictionary';
import {type Locale} from '@/config/i18n-config';
import TermsOfUse from "@/components/Legal/TermsOfUse/TermsOfUse";
import styles from './TermsOfUseClient.module.scss';

interface PrivacyPolicyClientProps {
    dictionary: Dictionary;
    lang: Locale;
}

export default function TermsOfUseClient({lang}: PrivacyPolicyClientProps) {
    const {setLocale} = useLocaleStore();

    useEffect(() => {
        setLocale(lang);
    }, [lang, setLocale]);

    return (
        <div className={styles.sections}>
            <TermsOfUse />
        </div>
    );
}
