import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/global.css';

export const metadata: Metadata = {
  title: 'NutriWay',
  description: 'Acompanhamento nutricional de pacientes'
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="pt-BR">
    <body>{children}</body>
  </html>
);

export default RootLayout;
