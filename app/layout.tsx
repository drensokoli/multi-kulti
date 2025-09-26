import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi Kulti - Discover World Cultures',
  description: 'An interactive 3D globe showcasing world cities through culture, food, adversity, and cooperation',
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