import { useNavigate } from 'react-router-dom';
export default function PatientCard({ patient }) {
  const navigate = useNavigate();
  return <button className="patient-card" onClick={() => navigate(`/paciente/${patient.id}`)}>
    <img src={patient.photo} className="patient-avatar"/><span>{patient.name}</span>
  </button>
}
