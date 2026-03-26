import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'KKZ Learning Hub',
  description:
    'Fun learning for Kitty, Karawa and Zech — Maths, English, Science and more!',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 min-h-screen">
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 3000, style: { fontFamily: 'Nunito, sans-serif', fontWeight: 700 } }} />
      </body>
    </html>
  );
}