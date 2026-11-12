import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import Layout from '../Layout';
import SectionTitle from '../SectionTitle';
import PatientCard from '../PatientCard';

const AVATAR = 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

const patients = [
  { id: 1, name: 'Mikaela Barros Cunha', photo: AVATAR },
  { id: 2, name: 'Emilly Silva', photo: AVATAR },
  { id: 3, name: 'Luiza Farias', photo: AVATAR },
  { id: 4, name: 'Lucas Emanuel', photo: AVATAR },
];

export default function Pacientes() {
  const [search, setSearch] = useState('');
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return <Layout>
    <section className="page">
      <SectionTitle
        eyebrow="Meus pacientes"
        title="Pacientes"
        action={<button className="primary-btn" onClick={() => alert('Novo paciente')}><UserPlus size={18}/> Novo</button>}
      />
      <label className="search-box">
        <Search size={18}/>
        <input placeholder="Buscar paciente..." value={search} onChange={e => setSearch(e.target.value)}/>
      </label>
      <div className="patient-list">
        {filtered.map(p => <PatientCard key={p.id} patient={p}/>)}
        {filtered.length === 0 && <p className="empty">Nenhum paciente encontrado.</p>}
      </div>
    </section>
  </Layout>
}