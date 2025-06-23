'use client';

import styles from './Footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import useDictionary from '@/hooks/useDictionary';
import SectionContainer from '@/components/common/Container/SectionContainer';

type FooterColumn =
    | {
    type: 'contacts';
    title: string;
    items: { icon: string; text: string }[];
}
    | {
    type: 'links';
    title: string;
    items: { text: string; href: string }[];
}
    | {
    type: 'brand';
    logo: string;
    description: string;
};

const Footer = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary?.common?.footer?.columns) return null;

    const columns = dictionary.common.footer.columns as FooterColumn[];

    return (
        <footer className={styles.footer}>
            <Image className={styles.blocks} src="/blocks3.svg" width={1000} height={1000} alt="Vector blocks" />
            <SectionContainer>
                <div className={styles.footerWrapper}>
                    <div className={styles.footerCols}>
                        {columns.map((col, index) => {
                            if (col.type === 'contacts') {
                                return (
                                    <nav className={styles.menu} key={index}>
                                        <h2>{col.title}</h2>
                                        <ul>
                                            {col.items.map((item, i) => (
                                                <li key={i}>
                                                    <Link href="#">
                                                        <Image
                                                            src={item.icon}
                                                            width={20}
                                                            height={20}
                                                            alt=""
                                                        />
                                                        <span>{item.text}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                );
                            }

                            if (col.type === 'links') {
                                return (
                                    <nav className={styles.menu} key={index}>
                                        <h2>{col.title}</h2>
                                        <ul>
                                            {col.items.map((item, i) => (
                                                <li key={i}>
                                                    <Link href={item.href}>
                                                        <span>{item.text}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                );
                            }

                            if (col.type === 'brand') {
                                return (
                                    <div className={styles.footerCol} key={index}>
                                        <Link href="/">
                                            <Image
                                                src={col.logo}
                                                width={120}
                                                height={32}
                                                alt="Logo"
                                                className={styles.footerLogo}
                                            />
                                        </Link>

                                        <p>© {new Date().getFullYear()} codewave.pro</p>
                                        <span>{col.description}</span>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                </div>
            </SectionContainer>
        </footer>
    );
};

export default Footer;