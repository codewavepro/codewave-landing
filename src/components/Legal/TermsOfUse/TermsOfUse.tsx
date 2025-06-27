'use client';

import styles from "../Legal.module.scss";
import SectionContainer from "@/components/common/Container/SectionContainer";
import useDictionary from "@/hooks/useDictionary";

const TermsOfUse = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary) return null;

    const t = dictionary.termsOfUse;

    return (
        <section className={styles.privacy}>
            <SectionContainer>
                <div className={styles.privacyWrapper}>
                    <div className={styles.privacyInfo}>
                        <h1>{t.title}</h1>
                        <p>{t.updated}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.acceptanceTitle}</h2>
                        <p>{t.acceptanceText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.licenseTitle}</h2>
                        <p>{t.licenseText}</p>
                        <p>{t.licenseProhibited}</p>
                        <ul>
                            {Array.isArray(t.licenseList) &&
                                t.licenseList.map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                        </ul>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.conductTitle}</h2>
                        <p>{t.conductText}</p>
                        <ul>
                            {Array.isArray(t.conductList) &&
                                t.conductList.map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                        </ul>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.disclaimerTitle}</h2>
                        <p>{t.disclaimerText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.linksTitle}</h2>
                        <p>{t.linksText}</p>
                    </div>

                    <div className={styles.privacyInfo}>
                        <h2>{t.contactTitle}</h2>
                        <p>
                            {t.contactText}{" "}
                            <a href="mailto:legal@codewavepro.com">legal@codewavepro.com</a>
                        </p>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
};

export default TermsOfUse;