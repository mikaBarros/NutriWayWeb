'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Plus, Utensils } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../../components/Layout';
import { getMealPlan, getPatient } from '../../../../services/api';
import type { MealPlanResponse, PatientResponse } from '../../../../services/api';

const MealPlan = () => {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const carregarPlano = async () => {
      const [patientData, planData] = await Promise.all([getPatient(params.id), getMealPlan(params.id)]);
      setPatient(patientData);
      setPlan(planData);
    };
    void carregarPlano();
  }, [params.id]);

  if (!patient || !plan) return <Layout><div className="page">Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="page meal-page">
        <button className="back" onClick={() => router.push(`/paciente/${params.id}`)} type="button"><ArrowLeft/> Voltar para informações</button>
        <div className="profile-head compact">
          <img src={patient.photo} alt=""/>
          <div>
            <small>PLANO ALIMENTAR</small>
            <h1>{patient.fullName}</h1>
            <p>Plano atual • objetivo: {patient.goal}</p>
          </div>
          <button className="soft-button" type="button"><Plus/> Adicionar refeição</button>
        </div>
        <div className="meal-list">
          {plan.meals.map(meal => (
            <article className="meal-card" key={meal.time}>
              <div className="meal-time"><Clock/><strong>{meal.time}</strong></div>
              <div className="meal-content">
                <h3><Utensils/> {meal.meal}</h3>
                <ul>{meal.items.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MealPlan;
