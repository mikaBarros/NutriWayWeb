'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Cake, UserRound, Utensils, HeartPulse } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { getPatient, savePatientDetails } from '../../../services/api';
import type { PatientDetails, PatientResponse } from '../../../services/types';

const PatientProfile = () => {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [details, setDetails] = useState<PatientDetails>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const data = await getPatient(params.id);
        setPatient(data);
        setDetails(data.details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar paciente.');
      } finally {
        setLoading(false);
      }
    };
    void carregarPaciente();
  }, [params.id]);

  const update = (field: keyof PatientDetails, value: string) =>
    setDetails(current => ({ ...current, [field]: value }));

  const save = async () => {
    if (!patient) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await savePatientDetails(patient.id, details);
      setMessage('Informações salvas com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="page">Carregando...</div></Layout>;
  if (!patient) return <Layout><div className="page">{error || 'Paciente não encontrado.'}</div></Layout>;

  return (
    <Layout>
      <div className="page patient-page">
        <button className="back" onClick={() => router.push('/dashboard')} type="button"><ArrowLeft/> Voltar</button>
        <div className="profile-head">
          <img src={patient.photo} alt=""/>
          <div><h1>{patient.fullName}</h1><p><Cake size={17}/> {patient.birth || '—'}</p></div>
        </div>
        <div className="tabs">
          <button className="active" type="button"><UserRound/> Informações</button>
          <button onClick={() => router.push(`/paciente/${patient.id}/plano`)} type="button"><Utensils/> Plano alimentar</button>
        </div>
        <section className="info-card">
          <h2>História pessoal e social</h2>
          <div className="form-grid">
            <div className="field">
              <label>Função intestinal</label>
              <select className="form-control" value={details.intestinal ?? ''} onChange={event => update('intestinal', event.target.value)}>
                <option value="">Selecione...</option>
                <option>Regular</option>
                <option>Constipação</option>
                <option>Diarreia</option>
                <option>Alternado</option>
              </select>
            </div>
            <div className="field">
              <label>Fumante</label>
              <select className="form-control" value={details.smoker ?? ''} onChange={event => update('smoker', event.target.value)}>
                <option value="">Selecione...</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
            <div className="field">
              <label>Qualidade de sono (horas)</label>
              <input className="form-control" type="number" min={0} step={0.5} value={details.sleep ?? ''} onChange={event => update('sleep', event.target.value)}/>
            </div>
            <div className="field">
              <label>Bebe álcool</label>
              <select className="form-control" value={details.alcohol ?? ''} onChange={event => update('alcohol', event.target.value)}>
                <option value="">Selecione...</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
            <div className="field">
              <label>Estado civil</label>
              <input className="form-control" value={details.marital ?? ''} onChange={event => update('marital', event.target.value)}/>
            </div>
            <div className="field">
              <label>Atividade física</label>
              <input className="form-control" value={details.activity ?? ''} onChange={event => update('activity', event.target.value)}/>
            </div>
            <div className="field">
              <label>Raça</label>
              <input className="form-control" value={details.race ?? ''} onChange={event => update('race', event.target.value)}/>
            </div>
            <div className="field">
              <label>Outras informações pessoais/sociais</label>
              <textarea className="form-control" value={details.other ?? ''} onChange={event => update('other', event.target.value)}/>
            </div>
          </div>
          <h3><HeartPulse size={18}/> História clínica</h3>
          <div className="form-grid">
            <div className="field">
              <label>Patologias</label>
              <textarea className="form-control" value={details.pathologies ?? ''} onChange={event => update('pathologies', event.target.value)}/>
            </div>
            <div className="field">
              <label>Medicação</label>
              <textarea className="form-control" value={details.medication ?? ''} onChange={event => update('medication', event.target.value)}/>
            </div>
          </div>
          {error && <p className="form-message error">{error}</p>}
          {message && <p className="form-message ok">{message}</p>}
          <div className="form-actions">
            <button className="primary" onClick={save} disabled={saving} type="button">{saving ? 'Salvando...' : 'Salvar informações'}</button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PatientProfile;
