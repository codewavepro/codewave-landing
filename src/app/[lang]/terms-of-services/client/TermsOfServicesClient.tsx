'use client';

import {useEffect} from 'react';
import {useLocaleStore} from '@/store/useLocaleStore';
import {type Dictionary} from '@/lib/dictionary';
import {type Locale} from '@/config/i18n-config';
import styles from './TermsOfServicesClient.module.scss';
import TermsOfService from "@/components/Legal/TermsOfService/TermsOfService";

interface TermsOfUseClientProps {
    dictionary: Dictionary;
    lang: Locale;
}

export default function TermsOfUseClient({lang}: TermsOfUseClientProps) {
    const {setLocale} = useLocaleStore();

    useEffect(() => {
        setLocale(lang);
    }, [lang, setLocale]);

    return (
        <div className={styles.sections}>
            <TermsOfService />
        </div>
    );
}
