'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useLocaleStore } from '@/store/useLocaleStore';
import useDictionary from '@/hooks/useDictionary';
import useIsMobile from '@/hooks/useIsMobile';
import { type Locale } from '@/config/i18n-config';
import LayoutContainer from '@/components/common/Container/SectionContainer';
import LangBtn from '@/components/buttons/LangBtn/LangBtn';
import styles from './Header.module.scss';

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const { setLocale } = useLocaleStore();
  const { dictionary, loading } = useDictionary();
  const isMobile = useIsMobile(1200)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);
  
  useEffect(() => {
    setLocale(lang);
  }, [lang, setLocale]);

  useEffect(() => {
    const targetElement = document.documentElement;

    if (isMobileMenuOpen) {
      disableBodyScroll(targetElement, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(targetElement);
    }

    return () => {
      enableBodyScroll(targetElement);
    };
  }, [isMobileMenuOpen]);

  const menuItems = useMemo(() => {
    if (!dictionary) return [];
    return [
      { name: dictionary.common.header.navigation.expertise, path: `/${lang}/#expertise` },
      { name: dictionary.common.header.navigation.cases, path: `/${lang}/#portfolio` },
      { name: dictionary.common.header.navigation.testimonials, path: `/${lang}/#testimonials` },
      { name: dictionary.common.header.navigation.about, path: `/${lang}/#about` },
      { name: dictionary.common.header.navigation.contact, path: `/${lang}/#contact` },
    ];
  }, [dictionary, lang]);

  if (loading || !dictionary) return null;

  const t = dictionary.common.header;

  return (
    <header className={styles.header}>
      <LayoutContainer>
        <div className={`${styles.headerWrapper} ${isMobileMenuOpen ? styles.opened : ''}`}>
          <Link href={`/${lang}`} className={styles.logo}>
            <Image 
              src="/images/logo.svg"
              alt="White logo" 
              width={200}
              height={40}
              priority 
            />
          </Link>
          {!isMobile && (
            <>
              <nav className={styles.nav}>
                <ul className={styles.navList}>
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.path} className={styles.navLink} onClick={handleMenuItemClick}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={styles.headerRight}>
                <LangBtn/>
                <Link href={`/${lang}/#contact`} className={styles.ctaBtn}>
                  {t.cta}
                  <div className={styles.glow}></div>
                  <div className={styles.box}></div>
                </Link>
              </div>
            </>
          )}
          
          {isMobile && (
            <>
              <button 
                className={`${styles.burgerBtn} ${isMobileMenuOpen ? styles.active : ''}`} 
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
              </button>
              
              <div ref={mobileMenuRef} className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav} aria-label="Mobile navigation">
                  <ul>
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link href={item.path} onClick={handleMenuItemClick}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className={styles.mobileBottom}>
                  <LangBtn isMobile={true} />
                  <Link href={`/${lang}/#contact}`} className={styles.ctaBtn} onClick={handleMenuItemClick}>
                    {t.cta}
                    <div className={styles.glow}></div>
                    <div className={styles.box}></div>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </LayoutContainer>
    </header>
  );
};