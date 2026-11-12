import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, Utensils, Cake, Mail, Smile } from 'lucide-react';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';

const AVATAR = 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

const patients = [
  { id: 1, name: 'Mikaela Barros Cunha', birth: '12 de jun. de 2012', photo: AVATAR },
  { id: 2, name: 'João Pedro Almeida', birth: '03 de mar. de 1990', photo: AVATAR },
  { id: 3, name: 'Maria Clara Souza', birth: '21 de set. de 1985', photo: AVATAR },
  { id: 4, name: 'Carlos Eduardo Lima', birth: '08 de dez. de 1978', photo: AVATAR },
];

export default function PerfilPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState('info');
  const [smoker, setSmoker] = useState(false);
  const patient = patients.find(p => p.id === Number(id));

  if (!patient) return <Layout><p className="empty">Paciente não encontrado.</p></Layout>;

  return <Layout>
    <section className="page">
      <div className="back-row">
        <button onClick={() => navigate('/pacientes')} aria-label="Voltar"><ChevronLeft size={26}/></button>
        <h1>Perfil do Paciente</h1>
      </div>

      <div className="profile-card">
        <img src={patient.photo} className="patient-avatar" alt=""/>
        <div>
          <strong>{patient.name}</strong>
          <span className="birth"><Cake size={16}/>{patient.birth}</span>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}><User size={16}/>Informações</button>
        <button className={tab === 'plano' ? 'active' : ''} onClick={() => setTab('plano')}><Utensils size={16}/>Plano Alimentar</button>
      </div>

      {tab === 'info' ? <>
        <div className="pills">
          <button className="pill" onClick={() => document.getElementById('consulta').scrollIntoView({ behavior: 'smooth' })}>Informação de consulta</button>
          <button className="pill off" onClick={() => document.getElementById('paciente').scrollIntoView({ behavior: 'smooth' })}>Informação do paciente</button>
        </div>

        <div className="form-block" id="consulta">
          <SectionTitle title={<><Mail size={24}/> Informações de consulta</>}/>
          <div className="field"><label>Motivação</label><textarea placeholder="Escreva aqui..."/></div>
          <div className="field"><label>Expectativas</label><textarea placeholder="Escreva aqui..."/></div>
          <div className="field">
            <label>Objetivos clínicos</label>
            <select>
              <option>Nenhum...</option>
              <option>Emagrecimento</option>
              <option>Ganho de massa</option>
              <option>Reeducação alimentar</option>
            </select>
          </div>
          <div className="field"><textarea placeholder="Escreva aqui..."/></div>
          <div className="field"><label>Outras informações da consulta</label><textarea placeholder="Escreva aqui..."/></div>
        </div>

        <div className="form-block" id="paciente">
          <SectionTitle title={<><Smile size={24}/> História pessoal e social</>}/>
          <div className="field">
            <label>Função intestinal</label>
            <select>
              <option>Selecione uma opção</option>
              <option>Regular</option>
              <option>Constipação</option>
              <option>Diarreia</option>
            </select>
          </div>
          <div className="field"><textarea placeholder="Escreva aqui..."/></div>
          <div className="field">
            <label>Fumante</label>
            <div className="row-btns">
              <button className={smoker ? 'sel' : ''} onClick={() => setSmoker(true)}>Sim</button>
              <button className={!smoker ? 'sel' : ''} onClick={() => setSmoker(false)}>Não</button>
            </div>
          </div>
        </div>

        <button className="save" onClick={() => alert('Informações salvas')}>Salvar informações</button>
      </> : <p className="empty">Nenhum plano alimentar cadastrado ainda.</p>}
    </section>
  </Layout>
}