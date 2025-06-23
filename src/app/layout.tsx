
import type { Metadata } from 'next';
import LocaleProvider from '@/providers/LocaleProvider';
import ReCaptchaProvider from '@/providers/ReCaptchaProvider';
import { Toaster } from 'react-hot-toast';
import '@/scss/main.scss';

export const metadata: Metadata = {
  title: 'Codewave',
  description: 'Innovative digital solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="ltr">
      <body>
          <LocaleProvider>
            <ReCaptchaProvider>
              <Toaster />
              {children}
            </ReCaptchaProvider>
          </LocaleProvider>
      </body>
    </html>
  );
}
