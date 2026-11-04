import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [error, setError] = useState('');

  const load = () => api.get('/instructor/courses').then((res) => setCourses(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/courses', form);
      setForm({ title: '', description: '', category: '' });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course and all its lessons?')) return;
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <>
      <h2>Instructor Dashboard</h2>
      <form className="form wide" onSubmit={create}>
        <h3>Create a course</h3>
        {error && <p className="error">{error}</p>}
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Category (e.g. Java, Web)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <textarea placeholder="Description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn">Create course</button>
      </form>

      <h3>My courses</h3>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c}>
            <Link className="btn" to={`/instructor/courses/${c.id}/lessons`}>Manage lessons</Link>{' '}
            <button className="btn danger" onClick={() => remove(c.id)}>Delete</button>
          </CourseCard>
        ))}
      </div>
    </>
  );
}
