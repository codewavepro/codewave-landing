'use client';

import styles from "../Legal.module.scss";
import SectionContainer from "@/components/common/Container/SectionContainer";
import useDictionary from "@/hooks/useDictionary";

const TermsOfService = () => {
  const { loading, dictionary } = useDictionary();

  if (loading || !dictionary) return null;

  const t = dictionary.termsOfServices;

  return (
      <section className={styles.privacy}>
        <SectionContainer>
          <div className={styles.privacyWrapper}>
            <div className={styles.privacyInfo}>
              <h1>{t.title}</h1>
              <p>{t.updated}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h2>{t.introTitle}</h2>
              <p>{t.introText}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h3>{t.servicesTitle}</h3>
              <p>{t.servicesText}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h2>{t.ipTitle}</h2>

              <h3>{t.ourContentTitle}</h3>
              <p>{t.ourContentText}</p>

              <h3>{t.yourContentTitle}</h3>
              <p>{t.yourContentText}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h2>{t.liabilityTitle}</h2>
              <p>{t.liabilityText}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h3>{t.terminationTitle}</h3>
              <p>{t.terminationText}</p>
            </div>

            <div className={styles.privacyInfo}>
              <h3>{t.changesTitle}</h3>
              <p>{t.changesText}</p>
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

export default TermsOfService;