'use client';

import { ReactNode } from 'react';
import { useInitLocale } from '@/hooks/useInitLocale';

interface LocaleProviderProps {
  children: ReactNode;
}

export default function LocaleProvider({ children }: LocaleProviderProps) {
  useInitLocale();

  return <>{children}</>;
}
