import { Metadata } from 'next';
import TermsOfUse from '@/components/Legal/TermsOfUse/TermsOfUse';

export const metadata: Metadata = {
  title: 'Terms of Use - codeWavePro',
  description: 'Understand the terms and conditions for using the codeWavePro website.',
  keywords: 'terms of use, website terms, user agreement, legal terms',
};

export default function TermsOfUsePage() {
  return <TermsOfUse />;
}
