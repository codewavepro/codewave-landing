'use client';

import {ReactNode} from 'react';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import {useLocaleStore} from "@/store/useLocaleStore";

interface ReCaptchaProviderProps {
    children: ReactNode;
}

export default function ReCaptchaProvider({children}: ReCaptchaProviderProps) {
    const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    const {locale} = useLocaleStore();

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaSiteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
                nonce: undefined,
                id: 'google-recaptcha-v3',
            }}
            language={locale}
            useRecaptchaNet={true}
            useEnterprise={false}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}