import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sebastian Mendo — Senior Product Designer',
  description: 'Portfolio of Sebastian Mendo, Senior Product Designer at JPMorgan Chase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
