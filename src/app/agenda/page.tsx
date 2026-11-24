import { CalendarDays } from 'lucide-react';
import Layout from '../../components/Layout';

const Agenda = () => (
  <Layout>
    <div className="page">
      <div className="section-title"><div><small>ORGANIZAÇÃO</small><h1>Agenda de consultas</h1></div></div>
      <div className="agenda-card">
        <CalendarDays size={42}/>
        <h2>Hoje, 06 de outubro</h2>
        <p>08:00 — Emily V. · Retorno</p>
        <p>10:30 — Gabriela · Avaliação</p>
        <p>14:00 — Mikaela · Acompanhamento</p>
        <button className="primary" type="button">Agendar consulta</button>
      </div>
    </div>
  </Layout>
);

export default Agenda;
