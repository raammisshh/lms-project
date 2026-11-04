import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';

export default function ManageLessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', videoUrl: '' });
  const [error, setError] = useState('');

  const load = () => api.get(`/courses/${id}/lessons`).then((res) => setLessons(res.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, [id]);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/courses/${id}/lessons`, form);
      setForm({ title: '', content: '', videoUrl: '' });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <>
      <Link to="/instructor">← Back to dashboard</Link>
      <h2>Manage lessons</h2>
      <form className="form wide" onSubmit={add}>
        {error && <p className="error">{error}</p>}
        <input placeholder="Lesson title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Video URL (YouTube link, optional)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <textarea placeholder="Lesson content" rows="5" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button className="btn">Add lesson</button>
      </form>
      <ol>
        {lessons.map((l) => <li key={l.id}>{l.title}</li>)}
      </ol>
    </>
  );
}
