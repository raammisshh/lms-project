import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/courses', { params: { q } }).then((res) => setCourses(res.data)).catch(() => {});
    }, 300); // small debounce for search
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <h2>All Courses</h2>
      <input className="search" placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid">
        {courses.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
      {courses.length === 0 && <p className="muted">No courses found.</p>}
    </>
  );
}
