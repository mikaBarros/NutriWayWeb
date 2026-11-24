'use client';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login } from '../services/api';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login({ email, password });
    if (result.ok) router.push('/dashboard');
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
          <label><UserRound/><input value={email} onChange={event => setEmail(event.target.value)} placeholder="Nome ou email"/></label>
          <label>
            <LockKeyhole/>
            <input type={show ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Senha"/>
            <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff/> : <Eye/>}</button>
          </label>
          <div className="login-options">
            <label className="check"><input type="checkbox" defaultChecked/><span>salvar login</span></label>
            <button type="button">esqueceu a senha?</button>
          </div>
          <button className="primary big" type="submit">Entrar</button>
          <div className="line"></div>
        </form>
      </section>
    </div>
  );
};

export default Login;
