'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '../../services/api';

const Cadastro = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await signUp({ fullName: fullName.trim(), email: email.trim(), password });
      if (result.hasSession) {
        router.replace('/dashboard');
        router.refresh();
      } else {
        setMessage('Conta criada! Confirme seu e-mail para ativar o acesso (ou desative a confirmação de e-mail no Supabase).');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="rings"></div>
        <div><h1>CRIE SUA<br/>CONTA</h1><p>Comece a acompanhar seus pacientes.</p></div>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <h2>Cadastro</h2>
          <label><input required value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Nome completo" autoComplete="name"/></label>
          <label><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="E-mail" autoComplete="email"/></label>
          <label><input type="password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} placeholder="Senha (mín. 6 caracteres)" autoComplete="new-password"/></label>
          {error && <p style={{ color: '#a3352b', fontWeight: 600 }}>{error}</p>}
          {message && <p style={{ color: '#075c2e', fontWeight: 600 }}>{message}</p>}
          <button className="primary big" type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
          <div className="line"></div>
          <p style={{ textAlign: 'center', marginTop: 18 }}>
            Já tem conta? <Link href="/" style={{ color: '#075c2e', fontWeight: 700 }}>Entrar</Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Cadastro;
