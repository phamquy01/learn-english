import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AppProvider from '@/AppProvider';
import { cookies } from 'next/headers';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
  title: 'Google Translate',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {' '}
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider initialAccessToken={accessToken?.value}>
            <Header />
            <div className="-full lg:max-w-7xl mx-auto"> {children}</div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
