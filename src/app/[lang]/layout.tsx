import {locales, type Locale} from '@/config/i18n-config';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import styles from './layout.module.scss'

export default async function LangLayout({children, params}:
                                         { children: React.ReactNode; params: Promise<{ lang: string }> }) {
    const {lang} = await params;
    if (!locales.includes(lang as Locale)) {
        console.error('Error in locale list');
    }

    return (
        <div className={styles.wrapper}>
            <Header lang={lang as Locale}/>
            <main>{children}</main>
            <CookieBanner />
            <Footer />
        </div>
    );
}
