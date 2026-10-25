import Providers from '@/providers/Providers';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Review',
  description: 'Project Review System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }}>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} bg-background text-primary-text max-w-screen min-h-screen overflow-x-hidden font-sans antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
