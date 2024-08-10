import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import AppProvider from '@/AppProvider';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  return (
    <html lang="en">
      <body className={inter.className}>
        {' '}
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header sessionToken={sessionToken?.value} />
          <AppProvider initialSessionToken={sessionToken?.value}>
            <div className="max-w-6xl mx-auto"> {children}</div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
