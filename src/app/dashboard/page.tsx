import { Plus, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import PatientCard from '../../components/PatientCard';
import SectionTitle from '../../components/SectionTitle';
import { patients } from '../../data/mock';

const Dashboard = () => (
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
        <SectionTitle eyebrow="ACOMPANHAMENTO" title="Meus Pacientes" action={<button className="soft-button" type="button"><Plus size={18}/> Novo paciente</button>} />
        <p className="subtitle">Acompanhe a evolução de cada um</p>
        <div className="search">
          <Search size={18}/><input placeholder="Buscar paciente..."/>
        </div>
        <div className="patient-grid">{patients.map(patient => <PatientCard key={patient.id} patient={patient}/>)}</div>
      </section>
      <section className="stats">
        <div><strong>24</strong><span>Pacientes ativos</span></div>
        <div><strong>08</strong><span>Consultas hoje</span></div>
        <div><strong>92%</strong><span>Adesão aos planos</span></div>
      </section>
    </div>
  </Layout>
);

export default Dashboard;
