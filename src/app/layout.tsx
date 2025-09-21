import './globals.css';
import './styles.css';
import { Metadata } from 'next';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'NFT D&D Character Sheet',
  description: 'Synchronize your D&D character with blockchain using Soulbound Tokens',
};

// Корневой серверный layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}