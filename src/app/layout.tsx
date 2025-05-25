import type { Metadata } from "next";
import { Viewport } from "next";
import { Puritan } from 'next/font/google';
import "./globals.css";

const puritan = Puritan({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-puritan'
});

export const metadata: Metadata = {
  title: "NCL IT",
  description: "Soluções Tecnológicas",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: 'black',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={puritan.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Soluções Tecnológicas" />
        <meta name="keywords" content="NCL IT, tecnologia, soluções tecnológicas, desenvolvimento web, aplicativos móveis, consultoria em TI" /> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}