'use client';

import { useState, FormEvent } from 'react';
import type { ReactNode } from 'react';
import styles from './Contact.module.scss';
import { validateContactDetails, validateDate, ContactMethod } from "@/shared/validation";
import useDictionary from '../../../hooks/useDictionary';
import DOMPurify from 'dompurify';
import useToast from '@/hooks/useToast';
import SectionContainer from "@/components/common/Container/SectionContainer";
import Button from "@/components/buttons/Button/Button";
import { AiOutlineMail } from "react-icons/ai";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { FaDiscord, FaLinkedin } from "react-icons/fa";
import useReCaptcha from '@/hooks/useReCaptcha';

type FormState = {
    success: boolean;
    message: string;
};

const Contact = () => {
    const { loading, dictionary } = useDictionary();
    const { getReCaptchaToken, loading: captchaLoading, ready: captchaReady } = useReCaptcha();
    const { showToast, showPromiseToast } = useToast();
    const [selectedMethod, setSelectedMethod] = useState<ContactMethod>('email');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: false,
        surname: false,
        message: false,
        contactDetails: false,
        privacyAccepted: false,
        deadline: false
    });

    if (loading || !dictionary) return null;

    const contactData = dictionary.home.contact;

    const contactMethods: { id: ContactMethod; icon: ReactNode; label: string }[] = [
        { id: 'email', icon: <AiOutlineMail />, label: 'Email' },
        { id: 'telegram', icon: <BiLogoTelegram />, label: 'Telegram' },
        { id: 'twitter', icon: <BsTwitterX />, label: 'Twitter' },
        { id: 'discord', icon: <FaDiscord />, label: 'Discord' },
        { id: 'linkedin', icon: <FaLinkedin />, label: 'LinkedIn' },
        { id: 'whatsapp', icon: <BsWhatsapp />, label: 'WhatsApp' }
    ];

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitAttempted(true);

        const form = e.currentTarget;
        const formValues = {
            name: DOMPurify.sanitize((form.elements.namedItem('name') as HTMLInputElement)?.value || ''),
            surname: DOMPurify.sanitize((form.elements.namedItem('surname') as HTMLInputElement)?.value || ''),
            message: DOMPurify.sanitize((form.elements.namedItem('message') as HTMLTextAreaElement)?.value || ''),
            contactDetails: DOMPurify.sanitize((form.elements.namedItem('contactDetails') as HTMLInputElement)?.value || ''),
            privacyAccepted: (form.elements.namedItem('privacyAccepted') as HTMLInputElement)?.checked || false,
            deadline: (form.elements.namedItem('deadline') as HTMLInputElement)?.value || ''
        };

        const errors = {
            name: !formValues.name,
            surname: !formValues.surname,
            message: !formValues.message || formValues.message.length < 30,
            contactDetails: !formValues.contactDetails || !validateContactDetails(selectedMethod, formValues.contactDetails),
            privacyAccepted: !formValues.privacyAccepted,
            deadline: formValues.deadline ? !validateDate(formValues.deadline) : false
        };

        setFieldErrors(errors);

        if (Object.values(errors).some(Boolean)) {
            showToast(contactData.toast['form.fillRequiredFields'], 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (!captchaReady) {
                showToast(contactData.toast['form.recaptchaNotReady'], 'error');
                setIsSubmitting(false);
                return;
            }

            const recaptchaToken = await getReCaptchaToken();
            if (!recaptchaToken) {
                showToast(contactData.toast['form.recaptchaMissing'], 'error');
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('surname', formValues.surname);
            formData.append('company', DOMPurify.sanitize((form.elements.namedItem('company') as HTMLInputElement)?.value || ''));
            formData.append('budget', DOMPurify.sanitize((form.elements.namedItem('budget') as HTMLInputElement)?.value || ''));
            formData.append('deadline', formValues.deadline);
            formData.append('message', formValues.message);
            formData.append('contactMethod', selectedMethod);
            formData.append('contactDetails', formValues.contactDetails);
            formData.append('privacyAccepted', formValues.privacyAccepted ? 'on' : '');
            formData.append('recaptchaToken', recaptchaToken);

            const sendRequest = async () => {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || contactData.toast['form.recaptchaFail']);
                }

                return result;
            };

            const result = await showPromiseToast(
                sendRequest(),
                {
                    loading: contactData.toast['form.sending'],
                    success: (result: FormState) => {
                        if (!result.success) {
                            throw new Error(result.message || contactData.toast['form.recaptchaFail']);
                        }
                        return contactData.toast['form.success'];
                    },
                    error: (err: unknown) => {
                        const key = err instanceof Error ? err.message : 'form.error';
                        return contactData.toast[key] || contactData.toast['form.error'];
                    }

                }
            );

            if (result.success) {
                form.reset();
                setSelectedMethod('email');
                setSubmitAttempted(false);
                setFieldErrors({
                    name: false,
                    surname: false,
                    message: false,
                    contactDetails: false,
                    privacyAccepted: false,
                    deadline: false
                });
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPlaceholderForMethod = (method: ContactMethod): string => {
        switch (method) {
            case 'email':
                return 'your@email.com';
            case 'telegram':
                return '@userId or t.me/@id';
            case 'twitter':
                return '@userId or twitter.com/@id';
            case 'discord':
                return 'discord.gg/invite';
            case 'linkedin':
                return 'linkedin.com/in/username';
            case 'whatsapp':
                return '+12345 or wa.me/123455';
            default:
                return 'Contact details';
        }
    };

    return (
        <section className={styles.contact}>
            <SectionContainer>
                <div className={styles.contactWrapper}>
                    <div className={styles.contactInfo}>
                        <h2>{contactData.h2}</h2>
                        <p>{contactData.subtext}</p>
                    </div>

                    <form className={styles.contactForm} onSubmit={handleSubmit}>
                        <fieldset>
                            <div className={styles.halfWidth}>
                                <div
                                    className={`${styles.inputRow} ${styles.required} ${(submitAttempted && fieldErrors.name) ? styles.error : ''}`}>
                                    <input
                                        type="text"
                                        placeholder={contactData.form.name}
                                        name="name"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className={`${styles.inputRow} ${styles.required} ${(submitAttempted && fieldErrors.surname) ? styles.error : ''}`}>
                                    <input
                                        type="text"
                                        placeholder={contactData.form.surname}
                                        name="surname"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className={styles.halfWidth}>
                                <div className={styles.inputRow}>
                                    <input
                                        type="text"
                                        placeholder={contactData.form.company}
                                        name="company"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className={styles.inputRow}>
                                    <input
                                        type="text"
                                        placeholder={contactData.form.budget}
                                        name="budget"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className={styles.deadline}>
                                <span>{contactData.form.deadline}</span>
                                <input
                                    type="date"
                                    name="deadline"
                                    disabled={isSubmitting}
                                    className={submitAttempted && fieldErrors.deadline ? styles.error : ''}
                                />
                            </div>
                            <div className={`${styles.inputRow} ${styles.required} ${(submitAttempted && fieldErrors.message) ? styles.error : ''}`}>
                                <textarea
                                    name="message"
                                    placeholder={contactData.form.message}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <div className={styles.preferredContact}>
                                <div className={styles.preferredLabel}>
                                    {contactData.form.preferred}
                                </div>
                                <div className={styles.contactMethodWrapper}>
                                    <div className={styles.preferredItems}>
                                        {contactMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`${styles.preferredItem} ${selectedMethod === method.id ? styles.active : ''}`}
                                                onClick={() => setSelectedMethod(method.id)}
                                            >
                                                {method.icon}
                                                <span>{method.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`${styles.contactDetailsInput} ${styles.required} ${(submitAttempted && fieldErrors.contactDetails) ? styles.error : ''}`}>
                                        <input
                                            type="text"
                                            name="contactDetails"
                                            placeholder={getPlaceholderForMethod(selectedMethod)}
                                            disabled={isSubmitting}
                                        />
                                        <input
                                            type="hidden"
                                            name="contactMethod"
                                            value={selectedMethod}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.checkWrapper} ${styles.required} ${(submitAttempted && fieldErrors.privacyAccepted) ? styles.error : ''}`}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="privacyAccepted"
                                        value="on"
                                        disabled={isSubmitting}
                                    />
                                    <span></span>
                                    {contactData.form.privacy}
                                </label>
                            </div>
                        </fieldset>

                        <Button
                            text={isSubmitting || captchaLoading ? contactData.toast['form.sending'] : contactData.form.button}
                            size="large"
                            color="light"
                            type="submit"
                            disabled={isSubmitting || captchaLoading}
                        />
                    </form>
                </div>
            </SectionContainer>
        </section>
    );
}

export default Contact;