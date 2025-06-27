import Image from 'next/image';
import Link from 'next/link';
import { BiWorld } from 'react-icons/bi';
import { FaEye } from "react-icons/fa";
import styles from './PortfolioItem.module.scss';

interface StackItem {
    icon: string;
}

interface portfolioItemProps {
    id: string;
    images: string[];
    h3: string;
    desc: string;
    stack: StackItem[];
    link: string;
    visit: string;
    reverse?: boolean;
}

const PortfolioItem = ({ id, images, h3, desc, stack, link, visit, reverse }: portfolioItemProps) => {
    return (
        <div className={`${styles.portfolioItem} ${reverse ? styles.reverse : ''}`}>
            <div
                className={styles.portfolioItemInner}
            >
                <div className={styles.portfolioItemImg}>
                    {images.map((img, idx) => (
                        <a
                            key={idx}
                            href={img}
                            data-fancybox={`gallery-${id}`}
                            style={idx > 0 ? { display: 'none' } : {}}
                        >
                            {idx === 0 && (
                                <Image
                                    src={img}
                                    width={608}
                                    height={340}
                                    alt={h3}
                                    className={styles.previewImg}
                                />
                            )}
                        </a>
                    ))}
                    <div className={styles.view}>
                        <FaEye />
                    </div>
                </div>
                <div className={styles.portfolioItemInfo}>
                    <h3>{h3}</h3>
                    <p>{desc}</p>
                    <div className={styles.portfolioItemBottom}>
                        <div className={styles.stackIcons}>
                            {stack.map((item) => (
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
                        {link && (
                            <Link
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.visitLink}
                            >
                                <BiWorld />
                                {visit}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioItem;