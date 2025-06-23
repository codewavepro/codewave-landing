import styles from './About.module.scss';
import Image from 'next/image';
import SectionContainer from "@/components/common/Container/SectionContainer";
import Titlebox from "@/components/TitleBox/Titlebox";
import {parseSafeHtml} from "@/lib/parseSafeHtml";
import useDictionary from "@/hooks/useDictionary";

interface AboutItem {
    title: string;
    text: string;
}

const About = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary) return null;

    const aboutData = dictionary.home.about;

    return (
        <section className={styles.about}>
            <Image className={styles.blocks} src="/blocks1.svg" width={1000} height={1000} alt="Vector blocks" />
            <SectionContainer>
                <div className={styles.aboutWrapper}>
                    <Titlebox title={aboutData.h2} text={aboutData.subtext} direction="center" />
                    <div className={styles.aboutInner}>
                        <div className={styles.aboutItems}>
                            {aboutData.items.map((item: AboutItem, index: number) => (
                                <div key={index} className={styles.aboutItem}>
                                    <h3>{parseSafeHtml(item.title)}</h3>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.aboutImages}>
                            <div className={styles.aboutImagesLeft}>
                                <Image src="/cwp.jpg" width={300} height={300} alt="desc" />
                                <Image src="/cwp.jpg" width={300} height={300} alt="desc" />
                            </div>
                            <div className={styles.aboutImagesRight}>
                                <Image src="/cwp.jpg" width={300} height={300} alt="desc" />
                                <Image src="/cwp.jpg" width={300} height={300} alt="desc" />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
};

export default About;