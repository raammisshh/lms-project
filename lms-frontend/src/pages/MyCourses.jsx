import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';

export default function MyCourses() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/student/courses').then((res) => setItems(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <h2>My Courses</h2>
      <div className="grid">
        {items.map((it) => (
          <CourseCard key={it.course.id} course={it.course}>
            <div className="progress"><div style={{ width: `${it.progress}%` }} /></div>
            <p className="small">{it.completedLessons}/{it.totalLessons} lessons • {it.progress}%</p>
            <Link className="btn" to={`/learn/${it.course.id}`}>Continue</Link>
          </CourseCard>
        ))}
      </div>
      {items.length === 0 && <p className="muted">You haven't enrolled yet. <Link to="/">Browse courses</Link></p>}
    </>
  );
}
