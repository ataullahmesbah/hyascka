import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/sections/footer';
import { LoadingScreen } from '@/components/loading-screen';
import { BackToTop } from '@/components/back-to-top';
import { AuthNotice } from '@/components/auth/auth-notice';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hyascka.com'),
  title: 'HYASCKA — AI-First Digital Solutions Company',
  description:
    'HYASCKA builds AI agents, intelligent automation, enterprise software, and high-performance digital experiences for startups and enterprises.',
  keywords: [
    'AI agents',
    'AI automation',
    'enterprise software',
    'custom web applications',
    'digital transformation',
    'AI development company',
  ],
  openGraph: {
    title: 'HYASCKA — AI-First Digital Solutions Company',
    description:
      'We build AI agents, intelligent automation, enterprise software, and modern digital experiences that drive business growth.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HYASCKA — AI-First Digital Solutions Company',
    description:
      'We build AI agents, intelligent automation, enterprise software, and modern digital experiences.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(!s){document.documentElement.classList.toggle('dark',m)}else if(s==='dark'){document.documentElement.classList.add('dark')}else if(s==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${display.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <LoadingScreen />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <BackToTop />
            <Suspense fallback={null}>
              <AuthNotice />
            </Suspense>
            <Toaster
              position="top-center"
              theme="system"
              toastOptions={{
                style: {
                  background: '#0A1F44',
                  color: '#F5F7FA',
                  border: '1px solid #1E3A6E',
                  fontSize: '14px',
                },
                className: 'font-sans',
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}