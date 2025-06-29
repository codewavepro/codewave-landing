import LocaleProvider from '@/providers/LocaleProvider';
import NotFoundClient from '@/components/NotFoundСlient/NotFoundClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Codewave | 404',
    robots: 'noindex, nofollow',
};

export default async function NotFoundPage() {
    return (
        <LocaleProvider>
            <main>
                <NotFoundClient />
            </main>
        </LocaleProvider>
    );
}