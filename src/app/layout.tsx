import type { Metadata } from 'next';
import { Outfit, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AchievementToast } from '@/components/AchievementToast';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-jp',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'うんこ (Unko) — Japanese Character Learning Platform',
  description:
    'Learn and practice Hiragana, Katakana, and JLPT N5 Kanji with interactive exercises, pronunciation audio, mistake tracking, and personalized revision on うんこ.',
  keywords: [
    'うんこ',
    'Unko',
    'Japanese',
    'Hiragana',
    'Katakana',
    'Kanji',
    'JLPT N5',
    'Learn Japanese',
    'Japanese Practice',
  ],
  authors: [{ name: 'うんこ Team' }],
};

export const viewport = {
  themeColor: '#240D16',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${notoSansJP.variable} dark h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#240D16] text-[#F8FAFC]">
        <AuthProvider>
          <ProgressProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <AchievementToast />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
