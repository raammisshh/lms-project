import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data)).catch((e) => setMsg(errMsg(e)));
  }, [id]);

  const enroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      navigate(`/learn/${id}`);
    } catch (e) {
      if (e.response?.status === 409) navigate(`/learn/${id}`); // already enrolled
      else setMsg(errMsg(e));
    }
  };

  if (!course) return <p>{msg || 'Loading...'}</p>;

  return (
    <div className="detail">
      <span className="tag">{course.category || 'General'}</span>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p className="small">By {course.instructorName} • {course.lessonCount} lessons</p>
      {msg && <p className="error">{msg}</p>}
      {!user && <Link className="btn" to="/login">Login to enroll</Link>}
      {user?.role === 'STUDENT' && <button className="btn" onClick={enroll}>Enroll / Continue</button>}
    </div>
  );
}
