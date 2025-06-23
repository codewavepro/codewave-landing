import styles from './Stats.module.scss';
import useDictionary from '@/hooks/useDictionary';
import SectionContainer from '@/components/common/Container/SectionContainer';

interface StatCard {
    title: string;
    description: string;
}

const Stats = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary) return null;

    const statsData: StatCard[] = dictionary.home.stats.items.map((item: any) => ({
        title: item.title,
        description: item.text,
    }));

    return (
        <section className={styles.stats}>
            <SectionContainer>
                <div className={styles.statsWrapper} role="list">
                    <h2 className={styles.hiddenHeading}>
                        {dictionary.home.stats.hidden}
                    </h2>
                    {statsData.map((card, index) => (
                        <article key={index} className={styles.statsCard} role="listitem">
                            <div className={styles.statsCardInner}>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </SectionContainer>
        </section>
    );
};

export default Stats;