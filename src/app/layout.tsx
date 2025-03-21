// Add this near the top of the file
import { initializeServer } from '@/lib/server-init';
import { Analytics } from "@vercel/analytics/react"

// Call it before the app starts
if (typeof window === 'undefined') {
  initializeServer();
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Precios Carne Argentina | Media Res y Cortes',
  description: 'Mercado Agroganadero de Buenos Aires',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}