'use client';

import { useState, type FormEvent } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { createPatient } from '../../../services/api';
import type { PatientStatus } from '../../../services/types';

const NovoPaciente = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<PatientStatus>('active');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const patient = await createPatient({
        fullName: fullName.trim(),
        preferredName: preferredName.trim(),
        birthDate,
        goal,
        status
      });
      router.push(`/paciente/${patient.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <Link className="back" href="/dashboard"><ArrowLeft/> Voltar</Link>
        <div className="section-title"><div><small>NOVO</small><h1>Cadastrar paciente</h1></div></div>
        <form className="info-card form-card" onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="fullName">Nome completo *</label>
              <input id="fullName" className="form-control" required value={fullName} onChange={event => setFullName(event.target.value)}/>
            </div>
            <div className="field">
              <label htmlFor="preferredName">Como prefere ser chamado</label>
              <input id="preferredName" className="form-control" value={preferredName} onChange={event => setPreferredName(event.target.value)}/>
            </div>
            <div className="field">
              <label htmlFor="birthDate">Data de nascimento</label>
              <input id="birthDate" className="form-control" type="date" value={birthDate} onChange={event => setBirthDate(event.target.value)}/>
            </div>
            <div className="field">
              <label htmlFor="goal">Objetivo</label>
              <select id="goal" className="form-control" value={goal} onChange={event => setGoal(event.target.value)}>
                <option value="">Selecione...</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Ganho de massa">Ganho de massa</option>
                <option value="Reeducação alimentar">Reeducação alimentar</option>
                <option value="Saúde e bem-estar">Saúde e bem-estar</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" className="form-control" value={status} onChange={event => setStatus(event.target.value as PatientStatus)}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          </div>
          {error && <p className="form-message error">{error}</p>}
          <div className="form-actions">
            <button className="primary" type="submit" disabled={loading}><UserPlus size={18}/> {loading ? 'Salvando...' : 'Cadastrar paciente'}</button>
            <Link className="soft-button" href="/dashboard">Cancelar</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NovoPaciente;
