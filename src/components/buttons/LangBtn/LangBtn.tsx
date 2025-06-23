'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocaleStore } from '@/store/useLocaleStore'
import { locales, localeLabels, Locale } from '@/config/i18n-config'
import styles from './LangBtn.module.scss'
import { MdLanguage } from "react-icons/md";

interface LangBtnProps {
  isMobile?: boolean;
  onLanguageSwitch?: () => void;
}

const LangBtn = ({ isMobile = false, onLanguageSwitch }: LangBtnProps) => {
  const { locale, setLocale } = useLocaleStore()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const langBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langBtnRef.current && !langBtnRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getPathWithoutLang = useCallback(() => {
    if (!pathname) return ''

    const segments = pathname.split('/')
    if (segments.length <= 2) return ''

    segments.splice(1, 1)
    return segments.join('/').substring(1) || ''
  }, [pathname])

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const switchLanguage = useCallback((newLang: Locale) => {
    const pathWithoutLang = getPathWithoutLang()
    const newPath = pathWithoutLang ? `/${newLang}/${pathWithoutLang}` : `/${newLang}`
    setLocale(newLang)
    router.push(newPath)
    
    if (onLanguageSwitch) {
      onLanguageSwitch()
    }
  }, [getPathWithoutLang, router, setLocale, onLanguageSwitch])

  if (isMobile) {
    return (
      <div className={styles.langMobile}>
        {locales.map(loc => (
          <button
            key={loc}
            className={`${styles.langBtn} ${loc === locale ? styles.active : ''}`}
            onClick={() => switchLanguage(loc)}
            aria-pressed={loc === locale}
          >
            <MdLanguage />
            <span>{loc}</span>
          </button>
        ))}
      </div>
    )
  }
  
  const currentLanguage = {
    code: locale,
    label: localeLabels[locale]
  }

  const otherLanguages = locales
    .filter(lang => lang !== locale)
    .map(lang => ({
      code: lang,
      label: localeLabels[lang]
    }))

  return (
    <div className={styles.lang} ref={langBtnRef}>
      <button
        className={styles.langBtn}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <MdLanguage />
        <span>{currentLanguage.code}</span>
      </button>

      {isOpen && (
        <ul className={styles.langList} role="menu">
          {otherLanguages.map(lang => (
            <li key={lang.code} role="menuitem">
              <button
                className={styles.langBtn}
                onClick={() => switchLanguage(lang.code as Locale)}
              >
                <MdLanguage />
                <span>{lang.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LangBtn