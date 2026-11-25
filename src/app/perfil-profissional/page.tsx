'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getProfile, saveProfile } from '../../services/api';
import type { ProfessionalProfile } from '../../services/types';
import pfp from '@/images/pfp.jpeg';

const ProfessionalProfilePage = () => {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setProfile(await getProfile());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const update = (field: keyof ProfessionalProfile, value: string) =>
    setProfile(current => (current ? { ...current, [field]: value } : current));

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        specialty: profile.specialty,
        professionalLicense: profile.professionalLicense
      });
      setMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="page">Carregando...</div></Layout>;
  if (!profile) return <Layout><div className="page">{error || 'Perfil não encontrado.'}</div></Layout>;

  return (
    <Layout>
      <div className="page">
        <div className="professional">
          <div className="avatar xl"><img src={pfp.src} alt={profile.fullName}/></div>
          <h1>{profile.fullName || 'Profissional'}</h1>
          <p>{profile.specialty || 'Nutricionista'}</p>
          <section className="info-card form-card">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="fullName">Nome completo</label>
                <input id="fullName" className="form-control" value={profile.fullName} onChange={event => update('fullName', event.target.value)}/>
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" className="form-control" value={profile.email} readOnly disabled/>
              </div>
              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" className="form-control" value={profile.phone} onChange={event => update('phone', event.target.value)}/>
              </div>
              <div className="field">
                <label htmlFor="specialty">Especialidade</label>
                <input id="specialty" className="form-control" value={profile.specialty} onChange={event => update('specialty', event.target.value)} placeholder="Ex.: Nutrição clínica"/>
              </div>
              <div className="field">
                <label htmlFor="license">CRN / Registro profissional</label>
                <input id="license" className="form-control" value={profile.professionalLicense} onChange={event => update('professionalLicense', event.target.value)}/>
              </div>
            </div>
            {error && <p className="form-message error">{error}</p>}
            {message && <p className="form-message ok">{message}</p>}
            <div className="form-actions">
              <button className="primary" onClick={save} disabled={saving} type="button">{saving ? 'Salvando...' : 'Salvar perfil'}</button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalProfilePage;
