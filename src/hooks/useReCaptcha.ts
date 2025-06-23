'use client';

import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';
import {useEffect, useState} from 'react';

export default function useReCaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (executeRecaptcha) {
      setReady(true);
    }
  }, [executeRecaptcha]);

  const getReCaptchaToken = async (): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA is not loaded or initialized');
      return null;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return await executeRecaptcha('contact_form');
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getReCaptchaToken, loading, ready };
}