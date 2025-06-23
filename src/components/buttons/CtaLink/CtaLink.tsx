import Link from 'next/link'
import styles from './CtaLink.module.scss';
import { FaArrowRight } from "react-icons/fa";

interface CtaButtonProps {
    text: string;
    href: string;
}

const CtaLink = ({text, href}:CtaButtonProps) => {
    return (
        <Link href={href} className={styles.ctaLink}>
            <span className={styles.ctaLinkInner}>
                <span className={styles.ctaLinkText}>{text}</span>
                <span className={styles.arrow}><FaArrowRight /></span>
            </span>
        </Link>
    )

}

export default CtaLink;