import styles from './Button.module.scss';

interface ButtonProps {
    text: string;
    size: "default" | "large" | "full";
    color: "dark" | "light";
    ariaLabel?: string;
    type?: "button" | "submit";
    onClick?: () => void;
    disabled?: boolean;
}

const Button = (
    { text, size, color, ariaLabel = text, type = "button", onClick, disabled }
    : ButtonProps) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[size]} ${styles[color]}`}
            aria-label={ariaLabel}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;