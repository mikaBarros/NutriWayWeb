'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Clock, Plus, Utensils } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../../components/Layout';
import { addMeal, getMealPlan, getPatient } from '../../../../services/api';
import type { MealPlanResponse, PatientResponse } from '../../../../services/types';

const MealPlan = () => {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [items, setItems] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const loadPlan = useCallback(async () => {
    const planData = await getMealPlan(params.id);
    setPlan(planData);
  }, [params.id]);

  useEffect(() => {
    const carregarPlano = async () => {
      try {
        const [patientData, planData] = await Promise.all([getPatient(params.id), getMealPlan(params.id)]);
        setPatient(patientData);
        setPlan(planData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar plano alimentar.');
      } finally {
        setLoading(false);
      }
    };
    void carregarPlano();
  }, [params.id]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patient) return;
    setSaving(true);
    setError('');
    try {
      await addMeal({
        patientId: patient.id,
        name: name.trim(),
        time,
        items: items.split('\n')
      });
      setName('');
      setTime('');
      setItems('');
      setShowForm(false);
      await loadPlan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar refeição.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="page">Carregando...</div></Layout>;
  if (!patient || !plan) return <Layout><div className="page">{error || 'Plano não encontrado.'}</div></Layout>;

  return (
    <Layout>
      <div className="page meal-page">
        <button className="back" onClick={() => router.push(`/paciente/${params.id}`)} type="button"><ArrowLeft/> Voltar para informações</button>
        <div className="profile-head compact">
          <img src={patient.photo} alt=""/>
          <div>
            <small>PLANO ALIMENTAR</small>
            <h1>{patient.fullName}</h1>
            <p>{plan.title} • objetivo: {patient.goal || '—'}</p>
          </div>
          <button className="soft-button" onClick={() => setShowForm(current => !current)} type="button"><Plus/> Adicionar refeição</button>
        </div>

        {showForm && (
          <form className="info-card form-card" onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="mealName">Nome da refeição *</label>
                <input id="mealName" className="form-control" required value={name} onChange={event => setName(event.target.value)} placeholder="Ex.: Café da manhã"/>
              </div>
              <div className="field">
                <label htmlFor="mealTime">Horário</label>
                <input id="mealTime" className="form-control" type="time" value={time} onChange={event => setTime(event.target.value)}/>
              </div>
            </div>
            <div className="field">
              <label htmlFor="mealItems">Itens (um por linha)</label>
              <textarea id="mealItems" className="form-control" value={items} onChange={event => setItems(event.target.value)} placeholder={'1 ovo mexido\n1 fatia de pão integral'}/>
            </div>
            <div className="form-actions">
              <button className="primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar refeição'}</button>
            </div>
          </form>
        )}

        {error && <p className="form-message error">{error}</p>}

        <div className="meal-list">
          {plan.meals.length === 0 && <p className="subtitle">Nenhuma refeição cadastrada ainda.</p>}
          {plan.meals.map(meal => (
            <article className="meal-card" key={meal.id}>
              <div className="meal-time"><Clock/><strong>{meal.time || '--:--'}</strong></div>
              <div className="meal-content">
                <h3><Utensils/> {meal.meal}</h3>
                <ul>{meal.items.map((item, index) => <li key={`${meal.id}-${index}`}>{item}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MealPlan;
