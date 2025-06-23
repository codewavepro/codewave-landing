'use client';

import {useEffect} from 'react';
import {useLocaleStore} from '@/store/useLocaleStore';
import {type Dictionary} from '@/lib/dictionary';
import {type Locale} from '@/config/i18n-config';
import Hero from "@/components/HomePage/Hero/Hero";
import Stats from "@/components/HomePage/Stats/Stats";
import Expertise from "@/components/HomePage/Expertise/Expertise";
import Cta from '@/components/HomePage/Cta/Cta'
import Portfolio from "@/components/HomePage/Portfolio/Portfolio";
import Testimonials from "@/components/HomePage/Testimonials/Testimonials";
import About from "@/components/HomePage/About/About";
import Contact from "@/components/HomePage/Contact/Contact";
import styles from './HomeClient.module.scss';

interface HomeClientProps {
    dictionary: Dictionary;
    lang: Locale;
}

export default function HomeClient({lang}: HomeClientProps) {
    const {setLocale} = useLocaleStore();

    useEffect(() => {
        setLocale(lang);
    }, [lang, setLocale]);

    return (
        <div className={styles.sections}>
            <Hero/>
            <Stats/>
            <Expertise/>
            <Cta />
            <Portfolio/>
            <Testimonials/>
            <About/>
            <Contact />
        </div>
    );
}
