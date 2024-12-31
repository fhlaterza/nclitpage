import type { Metadata } from "next";
import { Puritan } from 'next/font/google';
import "./globals.css";


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
    <html lang="en">
      <body
        className={`${puritan.variable} ${puritan.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
