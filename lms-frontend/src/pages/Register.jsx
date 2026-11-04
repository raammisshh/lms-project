import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate(data.role === 'STUDENT' ? '/' : '/instructor');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Full name" value={form.name}
             onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="email" placeholder="Email" value={form.email}
             onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password (min 6 chars)" value={form.password}
             onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="STUDENT">I am a Student</option>
        <option value="INSTRUCTOR">I am an Instructor</option>
      </select>
      <button className="btn">Register</button>
      <p className="small">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
