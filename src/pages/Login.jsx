import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
export default function Login(){
 const [show,setShow]=useState(false), [email,setEmail]=useState(''), [password,setPassword]=useState(''); const navigate=useNavigate();
 async function submit(e){e.preventDefault(); const r=await login({email,password}); if(r.ok) navigate('/dashboard');}
 return <div className="login-page"><section className="login-intro"><div className="rings"></div><div><h1>SEJA BEM<br/>VINDO!</h1><p>Faça login com sua conta já cadastrada.</p></div></section><section className="login-form-wrap"><form className="login-form" onSubmit={submit}><h2>Entrar</h2><label><UserRound/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Nome ou email"/></label><label><LockKeyhole/><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha"/><button type="button" className="eye" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></label><div className="login-options"><label className="check"><input type="checkbox" defaultChecked/><span>salvar login</span></label><button type="button">esqueceu a senha?</button></div><button className="primary big">Entrar</button><div className="line"></div></form></section></div>
}
