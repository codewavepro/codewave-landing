import styles from './Hero.module.scss';
import Image from 'next/image';
import circles from './Blobs.module.scss';
import useDictionary from '@/hooks/useDictionary';
import {useLocaleStore} from "@/store/useLocaleStore";
import LayoutContainer from "@/components/common/Container/SectionContainer";
import CtaLink from "@/components/buttons/CtaLink/CtaLink";
import TerminalAnimation from "@/components/TerminalAnimation/TerminalAnimation";

export default function Hero() {
    const { dictionary, loading } = useDictionary();
    const lang = useLocaleStore((state) => state.locale);

    if (loading || !dictionary) return null;
    
    const t = dictionary.home.hero

    return (
        <section
            className={styles.hero}
            role="region"
        >
            <Image className={styles.blocks} src="/images/blocks1.svg" width={1000} height={1000} alt="Vector blocks" />
            <LayoutContainer>
                <div className={styles.heroWrapper}>
                    <div className={styles.heroDesc}>
                        <div className={circles.blobs}>
                            {Array.from({ length: 9 }, (_, i) => (
                                <span key={i} className={circles[`blob${i + 1}`]}></span>
                            ))}
                        </div>
                        <div className={styles.heroHeading}>
                            <div className={styles.subtitle}>
                                {t.subtext}
                            </div>
                            <h1>
                                {t.h1}
                            </h1>
                            <p>
                                {t.desc}
                            </p>
                        </div>
                        <CtaLink text={t.cta} href={`/${lang}#stats`}></CtaLink>
                    </div>
                    <TerminalAnimation />
                </div>
            </LayoutContainer>
        </section>
    );
}