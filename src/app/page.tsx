import { redirect } from 'next/navigation';
import { defaultLocale } from '@/config/i18n-config';

export default function Home() {
  redirect(`/${defaultLocale}`);
}
