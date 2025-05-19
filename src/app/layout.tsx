import type { Metadata } from "next";
import { Puritan } from 'next/font/google';
import "./globals.css";
import Script from 'next/script';

<Script src="https://kit.fontawesome.com/c03bc1935d.js" crossOrigin="anonymous"></Script>

const puritan = Puritan({ 
  variable: "--font-puritan",
  subsets: ['latin'], 
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "NCL IT",
  description: "Soluções Tecnológicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="pt-BR"> {/* Mudei para pt-BR já que é empresa brasileira */}
      <head>
        <Script 
          src="https://kit.fontawesome.com/c03bc1935d.js" 
          crossOrigin="anonymous"
          strategy="beforeInteractive" // Otimização de carregamento
        />
      </head>
      <body className={`${puritan.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
