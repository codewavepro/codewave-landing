import { useState, useEffect } from "react";
import Image from "next/image";
import useDictionary from "@/hooks/useDictionary";
import useIsMobile from "@/hooks/useIsMobile";
import SectionContainer from "@/components/common/Container/SectionContainer";
import Titlebox from "@/components/TitleBox/Titlebox";
import TabButton from "@/components/buttons/TabButton/TabButton";
import styles from "./Expertise.module.scss";

interface StackItem {
    name: string;
    icon: string;
}

interface Tab {
    label: string;
    title: string;
    description: string;
    stack: StackItem[];
    image: string;
    icon: string;
}

const Expertise = () => {
    const { loading, dictionary } = useDictionary();
    const isMobile = useIsMobile(992)
    const [activeTab, setActiveTab] = useState(0);

    const tabs: Tab[] = dictionary?.home?.expertise?.tabs || [];
    const currentTab = tabs[activeTab];

    useEffect(() => {
        if (!dictionary) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                setActiveTab((prevTab) => (prevTab + 1) % tabs.length);
            } else if (event.key === "ArrowLeft") {
                setActiveTab((prevTab) => (prevTab - 1 + tabs.length) % tabs.length);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dictionary, tabs.length]);

    if (loading || !dictionary) return null;

    const t = dictionary.home.expertise;

    return (
        <section className={styles.expertise} id="expertise">
            <Image className={styles.blocks} src="/blocks2.svg" width={1000} height={1000} alt="Vector blocks" />
            <SectionContainer>
                <div className={styles.expertiseWrapper}>
                    <Titlebox
                        title={t.h2}
                        text={t.subtext}
                        direction="center"
                    />
                    <div className={styles.tabs}>
                        <ul role="tablist">
                            {tabs.map((tab: Tab, index: number) => (
                                <li key={index}>
                                    <TabButton
                                        text={tab.label}
                                        isActive={activeTab === index}
                                        onClick={() => setActiveTab(index)}
                                        id={String(index)}
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
                                <div className={styles.tabContentInfo}>
                                    <h3>{currentTab.title}</h3>
                                    {isMobile && (
                                        <div className={styles.tabContentImg}>
                                            <Image
                                                src={currentTab.image}
                                                alt={currentTab.title}
                                                width={702}
                                                height={501}
                                            />
                                        </div>
                                    )}
                                    <p>{currentTab.description}</p>
                                    <div className={styles.tabContentStack}>
                                        {currentTab.stack.map((item: StackItem, idx: number) => (
                                            <div className={styles.stackItem} key={idx}>
                                                <span>{item.name}</span>
                                                <Image
                                                    src={item.icon}
                                                    alt={item.name}
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {!isMobile && (
                                    <div className={styles.tabContentImg}>
                                        <Image
                                            src={currentTab.image}
                                            alt={currentTab.title}
                                            width={702}
                                            height={501}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
};

export default Expertise;