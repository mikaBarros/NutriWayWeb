'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Cake, UserRound, Utensils, HeartPulse } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { getPatient } from '../../../services/api';
import type { PatientResponse } from '../../../services/api';

interface FieldProps {
  label: string;
  value?: string | number;
}

const Field = ({ label, value }: FieldProps) => (
  <div className="field"><label>{label}</label><div>{value || '—'}</div></div>
);

const PatientProfile = () => {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const carregarPaciente = async () => {
      setPatient(await getPatient(params.id));
    };
    void carregarPaciente();
  }, [params.id]);

  if (!patient) return <Layout><div className="page">Carregando...</div></Layout>;

  const details = patient.details ?? {};

  return (
    <Layout>
      <div className="page patient-page">
        <button className="back" onClick={() => router.push('/dashboard')} type="button"><ArrowLeft/> Voltar</button>
        <div className="profile-head">
          <img src={patient.photo} alt=""/>
          <div><h1>{patient.fullName}</h1><p><Cake size={17}/> {patient.birth}</p></div>
        </div>
        <div className="tabs">
          <button className="active" type="button"><UserRound/> Informações</button>
          <button onClick={() => router.push(`/paciente/${patient.id}/plano`)} type="button"><Utensils/> Plano alimentar</button>
        </div>
        <section className="info-card">
          <h2>História pessoal e social</h2>
          <div className="form-grid">
            <Field label="Função intestinal" value={details.intestinal}/>
            <Field label="Fumante" value={details.smoker}/>
            <Field label="Qualidade de sono" value={details.sleep}/>
            <Field label="Bebe álcool" value={details.alcohol}/>
            <Field label="Estado civil" value={details.marital}/>
            <Field label="Atividade Física" value={details.activity}/>
            <Field label="Raça" value={details.race}/>
            <Field label="Outras informações pessoais/sociais" value={details.other}/>
          </div>
          <h3><HeartPulse size={18}/> História clínica</h3>
          <div className="form-grid">
            <Field label="Patologias" value={details.pathologies}/>
            <Field label="Medicação" value={details.medication}/>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PatientProfile;
