'use client';

import { useRouter } from 'next/navigation';
import type { PatientSummary } from '../data/mock';

interface PatientCardProps {
  patient: PatientSummary;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const router = useRouter();

  return (
    <button className="patient-card" onClick={() => router.push(`/paciente/${patient.id}`)} type="button">
      <img src={patient.photo} className="patient-avatar" alt=""/><span>{patient.name}</span>
    </button>
  );
};

export default PatientCard;
