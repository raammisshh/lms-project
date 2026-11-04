import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(data.role === 'STUDENT' ? '/my-courses' : '/instructor');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={form.email}
             onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" value={form.password}
             onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button className="btn">Login</button>
      <p className="small">No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
