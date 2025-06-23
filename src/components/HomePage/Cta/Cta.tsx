import {JSX} from "react";
import Link from 'next/link';
import useDictionary from "@/hooks/useDictionary";
import {parseSafeHtml} from "@/lib/parseSafeHtml";
import SectionContainer from "@/components/common/Container/SectionContainer";
import CtaLink from "@/components/buttons/CtaLink/CtaLink";
import {BiLogoTelegram, BiLogoWhatsapp} from "react-icons/bi";
import {AiOutlineLinkedin, AiOutlineDiscord} from "react-icons/ai";
import {BsTwitterX} from "react-icons/bs";
import styles from "./Cta.module.scss";

type LinkItem = {
    href: string;
    icon: JSX.Element;
    label: string;
};

const Cta = () => {
    const {loading, dictionary} = useDictionary();

    const links: LinkItem[] = [
        {
            href: "#1",
            icon: <BiLogoTelegram/>,
            label: "Telegram",
        },
        {
            href: "#5",
            icon: <BiLogoWhatsapp/>,
            label: "Whatsapp",
        },
        {
            href: "#2",
            icon: <AiOutlineLinkedin/>,
            label: "LinkedIn",
        },
        {
            href: "#3",
            icon: <BsTwitterX/>,
            label: "Twitter",
        },
        {
            href: "#4",
            icon: <AiOutlineDiscord/>,
            label: "Discord",
        }
    ];


    if (loading || !dictionary) return null;

    const ctaData = dictionary.home.cta;

    return (
        <section className={styles.cta}>
            <SectionContainer>
                <div className={styles.ctaWrapper}>
                    <div className={styles.ctaInner}>
                        <div className={styles.ctaInfo}>
                            <h2>{parseSafeHtml(ctaData.h2)}</h2>
                            <p>{ctaData.subtext}</p>
                            <CtaLink href="/" text={ctaData.btn}/>
                        </div>
                        <div className={styles.ctaContacts}>
                            <p>
                                {ctaData.desc}
                            </p>
                            <ul className={styles.contactsList}>
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={link.label}
                                            title={link.label}
                                            className={styles.contactLink}
                                        >
                                            {link.icon}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <h2></h2>
            </SectionContainer>
        </section>
    )
}

export default Cta;