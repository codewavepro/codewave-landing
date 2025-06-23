import styles from './TabButton.module.scss';

interface TabButtonProps {
    id: string;
    text: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = ({ id, text, isActive, onClick }: TabButtonProps) => {
    return (
        <button
            id={`tab-${id}`}
            className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
            onClick={onClick}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-content-${id}`}
        >
            {text}
        </button>
    );
};

export default TabButton;