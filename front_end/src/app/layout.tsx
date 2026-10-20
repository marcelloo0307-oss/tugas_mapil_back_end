import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Jurnal Alam Mapil — Catatan Eksplorasi Rimba & Konservasi Nusantara',
  description: 'Wadah publikasi jurnal ilmiah populer, catatan observasi keanekaragaman hayati, geologi karst, dan dokumentasi ekspedisi alam liar Indonesia.',
  keywords: ['jurnal alam', 'eksplorasi rimba', 'konservasi indonesia', 'botani', 'fauna liar', 'pendakian gunung', 'geologi karst', 'mapil'],
  authors: [{ name: 'Tim Eksplorasi Jurnal Alam Mapil' }],
  openGraph: {
    title: 'Jurnal Alam Mapil — Eksplorasi Rimba & Observasi Alam Nusantara',
    description: 'Catatan lapangan, ekspedisi gunung, dan riset keanekaragaman hayati tropis Nusantara.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
