import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, CalendarDays, UserRound, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark">nutri<span>.</span></div>
      <div className="top-user"><div className="avatar small"><img src="https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80"/></div><div><strong>Olá,</strong><span>Rayanne Soares Ribeiro</span></div></div>
      <button className="logout" onClick={() => navigate('/')} title="Sair"><LogOut size={19}/></button>
    </header>
    <main>{children}</main>
    <nav className="bottom-nav">
      <NavLink to="/dashboard"><Home/></NavLink><NavLink to="/dashboard"><Users/></NavLink><NavLink to="/agenda"><CalendarDays/></NavLink><NavLink to="/perfil-profissional"><UserRound/></NavLink>
    </nav>
  </div>
}
