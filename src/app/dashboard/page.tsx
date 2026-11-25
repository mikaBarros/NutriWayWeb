'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import PatientCard from '../../components/PatientCard';
import SectionTitle from '../../components/SectionTitle';
import { getPatients } from '../../services/api';
import type { Patient } from '../../services/types';

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setPatients(await getPatients());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(
    () => patients.filter(patient => patient.fullName.toLowerCase().includes(search.toLowerCase())),
    [patients, search]
  );

  const activeCount = patients.filter(patient => patient.status === 'active').length;
  const averageProgress = patients.length
    ? Math.round(patients.reduce((total, patient) => total + patient.progress, 0) / patients.length)
    : 0;

  return (
    <Layout>
      <div className="dashboard page">
        <section className="hero-welcome">
          <div>
            <h1>Equilíbrio, saúde e<br/>bem-estar: mude sua rotina<br/>com o nosso app de nutrição.</h1>
            <p>Acompanhe seus pacientes de forma simples e humana.</p>
          </div>
          <div className="hero-illustration">🥗</div>
        </section>
        <section className="patients-box">
          <SectionTitle
            eyebrow="ACOMPANHAMENTO"
            title="Meus Pacientes"
            action={<Link className="soft-button" href="/paciente/novo"><Plus size={18}/> Novo paciente</Link>}
          />
          <p className="subtitle">Acompanhe a evolução de cada um</p>
          <div className="search">
            <Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar paciente..."/>
          </div>
          {error && <p style={{ color: '#a3352b', fontWeight: 600 }}>{error}</p>}
          {loading ? (
            <p className="subtitle">Carregando pacientes...</p>
          ) : filtered.length === 0 ? (
            <p className="subtitle">Nenhum paciente cadastrado ainda.</p>
          ) : (
            <div className="patient-grid">{filtered.map(patient => <PatientCard key={patient.id} patient={patient}/>)}</div>
          )}
        </section>
        <section className="stats">
          <div><strong>{String(activeCount).padStart(2, '0')}</strong><span>Pacientes ativos</span></div>
          <div><strong>{String(patients.length).padStart(2, '0')}</strong><span>Pacientes cadastrados</span></div>
          <div><strong>{averageProgress}%</strong><span>Adesão média aos planos</span></div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
