import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LegacyCore — COBOL Payroll Engine',
  description: '1959 meets 2025: COBOL payroll computation with a modern dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
