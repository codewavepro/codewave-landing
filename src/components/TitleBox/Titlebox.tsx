import SectionContainer from "@/components/common/Container/SectionContainer";
import styles from './Titlebox.module.scss';

interface TitleboxProps {
    title: string;
    text: string;
    direction: "left" | "center";
}

const Titlebox = ({ title, text, direction }: TitleboxProps) => {
    return (
        <div className={`${styles.titlebox} ${styles[direction]}`}>
            <SectionContainer>
                <div className={styles.titleboxWrapper}>
                    <div className={styles.titleboxInner}>
                        <h2>{title}</h2>
                        <p>{text}</p>
                    </div>
                </div>
            </SectionContainer>
        </div>
    );
};

export default Titlebox;