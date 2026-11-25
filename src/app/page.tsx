'use client';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../services/api';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email: email.trim(), password });
      if (result.ok) {
        router.replace('/dashboard');
        router.refresh();
      } else {
        setError(result.error ?? 'Não foi possível entrar.');
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
        <div><h1>SEJA BEM<br/>VINDO!</h1><p>Faça login com sua conta já cadastrada.</p></div>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <h2>Entrar</h2>
          <label><UserRound/><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="E-mail" autoComplete="email"/></label>
          <label>
            <LockKeyhole/>
            <input type={show ? 'text' : 'password'} required value={password} onChange={event => setPassword(event.target.value)} placeholder="Senha" autoComplete="current-password"/>
            <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff/> : <Eye/>}</button>
          </label>
          {error && <p style={{ color: '#a3352b', fontWeight: 600, margin: '0 0 8px' }}>{error}</p>}
          <div className="login-options">
            <label className="check"><input type="checkbox" defaultChecked/><span>salvar login</span></label>
            <button type="button">esqueceu a senha?</button>
          </div>
          <button className="primary big" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <div className="line"></div>
          <p style={{ textAlign: 'center', marginTop: 18 }}>
            Ainda não tem conta? <Link href="/cadastro" style={{ color: '#075c2e', fontWeight: 700 }}>Cadastre-se</Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
