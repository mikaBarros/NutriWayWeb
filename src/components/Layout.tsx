'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, CalendarDays, UserRound, LogOut } from 'lucide-react';
import { getProfile, logout } from '../services/api';
import pfp from '@/images/pfp.jpeg';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: Home },
  { href: '/dashboard', icon: Users },
  { href: '/agenda', icon: CalendarDays },
  { href: '/perfil-profissional', icon: UserRound }
];

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const profile = await getProfile();
        if (active && profile?.fullName) setName(profile.fullName);
      } catch {
        // Mantém o cabeçalho sem nome caso o perfil ainda não esteja disponível.
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">NutriWay<span>.</span></div>
        <div className="top-user">
          <div className="avatar small">
            <img src={pfp.src} alt="" />
          </div>
          <div><strong>Olá,</strong><span>{name || 'Profissional'}</span></div>
        </div>
        <button className="logout" onClick={handleLogout} title="Sair" type="button"><LogOut size={19}/></button>
      </header>
      <main>{children}</main>
      <nav className="bottom-nav">
        {navItems.map(({ href, icon: Icon }, index) => (
          <Link key={`${href}-${index}`} href={href} className={pathname === href ? 'active' : undefined}>
            <Icon/>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
