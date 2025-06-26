'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from './Portfolio.module.scss';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import useDictionary from "@/hooks/useDictionary";
import SectionContainer from "@/components/common/Container/SectionContainer";
import Titlebox from "@/components/TitleBox/Titlebox";
import PortfolioItem from "@/components/TabItem/PortfolioItem";
import Button from "@/components/buttons/Button/Button";

interface StackItem {
    icon: string;
}

interface TabContent {
    id: string;
    label: string;
    images: string[];
    h3: string;
    desc: string;
    stack: StackItem[];
    link: string;
}

const Portfolio = () => {
    const { loading, dictionary } = useDictionary();
    const [visibleItems, setVisibleItems] = useState(4);

    const allItems: TabContent[] = dictionary?.home?.portfolio?.tabs || [];
    const portfolioData = dictionary?.home?.portfolio;

    const loadMoreItems = () => setVisibleItems(prev => prev + 4);

    useEffect(() => {
        Fancybox.bind();
        return () => {
            Fancybox.destroy();
        };
    }, [allItems]);

    if (loading || !portfolioData) return null;

    return (
        <section className={styles.portfolio} id="portfolio">
            <Image className={styles.blocks} src="/blocks3.svg" width={1000} height={1000} alt="Vector blocks"/>
            <SectionContainer>
                <div className={styles.portfolioWrapper}>
                    <Titlebox
                        title={portfolioData.h2}
                        text={portfolioData.subtext}
                        direction="center"
                    />

                    <div className={styles.portfolioInner}>
                        {allItems.slice(0, visibleItems).map((tab, index) => (
                            <PortfolioItem
                                key={tab.id}
                                id={tab.id}
                                images={tab.images}
                                h3={tab.h3}
                                desc={tab.desc}
                                stack={tab.stack}
                                link={tab.link}
                                visit={portfolioData.visit}
                                reverse={index % 2 === 1}
                            />
                        ))}
                    </div>

                    {allItems.length > visibleItems && (
                        <Button
                            text={portfolioData.load}
                            size="large"
                            color="light"
                            onClick={loadMoreItems}
                        />
                    )}
                </div>
            </SectionContainer>
        </section>
    );
};

export default Portfolio;