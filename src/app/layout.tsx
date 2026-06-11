import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Handcrafted Haven',
    template: '%s | Handcrafted Haven',
  },
  description: 'Discover unique handcrafted items made by artisans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
