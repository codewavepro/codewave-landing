'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import useDictionary from "@/hooks/useDictionary";
import '../../../../node_modules/swiper/swiper-bundle.min.css';
import styles from './Testimonials.module.scss';
import SectionContainer from "@/components/common/Container/SectionContainer";
import Titlebox from "@/components/TitleBox/Titlebox";

interface TestimonialSlide {
    img: string;
    stars: number;
    p: string;
    name: string;
    position: string;
}

const Testimonials = () => {
    const { loading, dictionary } = useDictionary();

    if (loading || !dictionary) return null;

    const {
        h2,
        subtext,
        slides
    }: {
        h2: string;
        subtext: string;
        slides: TestimonialSlide[];
    } = dictionary.home.testimonials;

    return (
        <section className={styles.testimonials} id="testimonials">
            <Image className={styles.blocks} src="/blocks4.svg" width={1000} height={1000} alt="Vector blocks" />
            <SectionContainer>
                <div className={styles.testimonialsWrapper}>
                    <Titlebox
                        title={h2}
                        text={subtext}
                        direction="center"
                    />

                    <Swiper
                        className={styles.swiper}
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={32}
                        slidesPerView={1}
                        navigation
                        speed={300}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            dynamicMainBullets: 4
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 32,
                            }
                        }}
                    >
                        {slides.map((t: TestimonialSlide, index: number) => (
                            <SwiperSlide key={index} className={styles.slide}>
                                <div className={styles.card}>
                                    <div className={styles.cardTop}>
                                        <Image
                                            src={t.img}
                                            alt={t.name}
                                            width={75}
                                            height={75}
                                            className={styles.avatar}
                                        />
                                        <div className={styles.stars}>
                                            {Array.from({ length: t.stars }).map((_, i: number) => (
                                                <Image
                                                    key={i}
                                                    src="/icons/star.svg"
                                                    alt="Star"
                                                    width={20}
                                                    height={20}
                                                    className={styles.starIcon}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <p>{t.p}</p>
                                    </div>
                                    <div className={styles.cardBottom}>
                                        <span className={styles.name}>{t.name}</span>
                                        <span className={styles.position}>{t.position}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </SectionContainer>
        </section>
    );
};

export default Testimonials;