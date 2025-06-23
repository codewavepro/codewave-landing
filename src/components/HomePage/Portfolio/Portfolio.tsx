import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiWorld } from "react-icons/bi";
import styles from './Portfolio.module.scss';
import useDictionary from "@/hooks/useDictionary";
import SectionContainer from "@/components/common/Container/SectionContainer";
import Titlebox from "@/components/TitleBox/Titlebox";
import TabButton from "@/components/buttons/TabButton/TabButton";
import Button from "@/components/buttons/Button/Button";

interface StackItem {
    icon: string;
}

interface TabContent {
    label: string;
    img: string;
    h3: string;
    desc: string;
    stack: StackItem[];
    link: string;
}

type TabsMap = Record<string, TabContent[]>;

const Portfolio = () => {
    const { loading, dictionary } = useDictionary();
    const [activeTab, setActiveTab] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);

    const tabButtons: string[] = dictionary?.home?.portfolio?.tabButtons || [];
    const rawTabs: TabContent[] = dictionary?.home?.portfolio?.tabs || [];

    const mergedTabs: TabsMap = useMemo(() => {
        return rawTabs.reduce((acc: TabsMap, item: TabContent) => {
            if (!acc[item.label]) acc[item.label] = [];
            acc[item.label].push(item);
            return acc;
        }, {});
    }, [rawTabs]);

    const currentLabel = tabButtons[activeTab];
    const currentTabs = mergedTabs[currentLabel] || [];

    const loadMoreItems = () => {
        setVisibleItems((prev) => prev + 4);
    };

    const shouldShowLoadButton = currentTabs.length > visibleItems;

    useEffect(() => {
        setVisibleItems(4);
    }, [activeTab]);

    if (loading || !dictionary) return null;
    
    const portfolioData = dictionary.home.portfolio

    return (
        <section className={styles.portfolio}>
            <Image className={styles.blocks} src="/blocks3.svg" width={1000} height={1000} alt="Vector blocks" />
            <SectionContainer>
                <div className={styles.portfolioWrapper}>
                    <Titlebox
                        title={portfolioData.h2}
                        text={portfolioData.subtext}
                        direction="center"
                    />
                    <div className={styles.tabs}>
                        <ul role="tablist" className={styles.tabList}>
                            {tabButtons.map((label, index) => (
                                <li key={label} role="presentation">
                                    <TabButton
                                        id={`tab-${index}`}
                                        text={label}
                                        isActive={activeTab === index}
                                        onClick={() => setActiveTab(index)}
                                    />
                                </li>
                            ))}
                        </ul>
                        <div
                            className={styles.tabContent}
                            id={`tab-content-${activeTab}`}
                            role="tabpanel"
                            aria-labelledby={`tab-${activeTab}`}
                        >
                            <div className={styles.tabContentInner}>
                                {currentTabs.slice(0, visibleItems).map((tab, i) => (
                                    <div key={`${tab.h3}-${i}`} className={styles.tabItem}>
                                        <div className={styles.tabItemInner}>
                                            <div className={styles.tabItemImg}>
                                                <Image
                                                    src={tab.img}
                                                    width={608}
                                                    height={340}
                                                    alt={tab.h3}
                                                    className={styles.previewImg}
                                                />
                                            </div>
                                            <div className={styles.tabItemInfo}>
                                                <h3>{tab.h3}</h3>
                                                <p>{tab.desc}</p>
                                                <div className={styles.tabItemBottom}>
                                                    <div className={styles.stackIcons}>
                                                        {tab.stack.map((item) => (
                                                            <div key={item.icon} className={styles.stackItem}>
                                                                <Image
                                                                    src={item.icon}
                                                                    width={24}
                                                                    height={24}
                                                                    alt=""
                                                                    className={styles.stackIcon}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Link
                                                        href={tab.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.visitLink}
                                                    >
                                                        <BiWorld />
                                                        View Website
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {shouldShowLoadButton && (
                            <Button
                                text={portfolioData.load}
                                size="large"
                                color="light"
                                onClick={loadMoreItems}
                            />
                        )}
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
};

export default Portfolio;