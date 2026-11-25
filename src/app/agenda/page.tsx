'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import { createConsultation, getConsultations, getPatients } from '../../services/api';
import type { Consultation, Patient } from '../../services/types';

const formatSchedule = (iso: string) => {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};

const Agenda = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [type, setType] = useState('Avaliação');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [consultationData, patientData] = await Promise.all([getConsultations(), getPatients()]);
    setConsultations(consultationData);
    setPatients(patientData);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar agenda.');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [load]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createConsultation({ patientId: Number(patientId), scheduledAt, type, notes });
      setPatientId('');
      setScheduledAt('');
      setNotes('');
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar consulta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <div className="section-title"><div><small>ORGANIZAÇÃO</small><h1>Agenda de consultas</h1></div></div>

        {error && <p className="form-message error">{error}</p>}

        <div className="agenda-card">
          <CalendarDays size={42}/>
          <h2>Próximas consultas</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : consultations.length === 0 ? (
            <p>Nenhuma consulta agendada.</p>
          ) : (
            consultations.map(consultation => {
              const schedule = formatSchedule(consultation.scheduledAt);
              return (
                <p key={consultation.id}>
                  {schedule.time} — {consultation.patientName} · {consultation.type} · {schedule.day}
                </p>
              );
            })
          )}
          <button className="primary" onClick={() => setShowForm(current => !current)} type="button"><Plus size={18}/> Agendar consulta</button>
        </div>

        {showForm && (
          <form className="info-card form-card" onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="patient">Paciente *</label>
                <select id="patient" className="form-control" required value={patientId} onChange={event => setPatientId(event.target.value)}>
                  <option value="">Selecione...</option>
                  {patients.map(patient => <option key={patient.id} value={patient.id}>{patient.fullName}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="scheduledAt">Data e hora *</label>
                <input id="scheduledAt" className="form-control" type="datetime-local" required value={scheduledAt} onChange={event => setScheduledAt(event.target.value)}/>
              </div>
              <div className="field">
                <label htmlFor="type">Tipo</label>
                <select id="type" className="form-control" value={type} onChange={event => setType(event.target.value)}>
                  <option>Avaliação</option>
                  <option>Retorno</option>
                  <option>Acompanhamento</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="notes">Observações</label>
              <textarea id="notes" className="form-control" value={notes} onChange={event => setNotes(event.target.value)}/>
            </div>
            <div className="form-actions">
              <button className="primary" type="submit" disabled={saving}>{saving ? 'Agendando...' : 'Confirmar agendamento'}</button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Agenda;
