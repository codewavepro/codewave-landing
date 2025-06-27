'use client';

import styles from "../Legal.module.scss";
import useDictionary from "@/hooks/useDictionary";
import SectionContainer from "@/components/common/Container/SectionContainer";

const PrivacyPolicy = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary) return null;

    const t = dictionary.privacy;

    return (
        <section className={styles.privacy}>
            <SectionContainer>
                <div className={styles.privacyWrapper}>
                    <div className={styles.privacyInfo}>
                        <h1>{t.title}</h1>
                        <p className={styles.lastUpdated}>{t.updated}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.introTitle}</h2>
                        <p>{t.introText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.infoTitle}</h3>
                        <p>{t.infoText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.personalTitle}</h3>
                        <p>{t.personalText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.usageTitle}</h3>
                        <p>{t.usageText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.trackingTitle}</h3>
                        <p>{t.trackingText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.useTitle}</h3>
                        <h3>{t.useTitle}</h3>
                        <p>{t.useText}</p>
                        <ul className={styles.list}>
                            {t.list.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.securityTitle}</h3>
                        <p>{t.securityText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.rightsTitle}</h3>
                        <p>{t.rightsText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h3>{t.contactTitle}</h3>
                        <p>
                            {t.contactText}{" "}
                            <a href="mailto:privacy@codewavepro.com">privacy@codewavepro.com</a>
                        </p>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
};

export default PrivacyPolicy;