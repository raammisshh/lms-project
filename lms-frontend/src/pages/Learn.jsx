import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios.js';

// Turn a normal YouTube link into an embeddable one
const toEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export default function Learn() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}/lessons`)
      .then((res) => { setLessons(res.data); setCurrent(res.data[0]?.id ?? null); })
      .catch((e) => setError(errMsg(e)));
  }, [id]);

  const lesson = lessons.find((l) => l.id === current);
  const done = lessons.filter((l) => l.completed).length;
  const pct = lessons.length ? Math.round((done * 100) / lessons.length) : 0;

  const complete = async () => {
    await api.post(`/lessons/${lesson.id}/complete`);
    setLessons(lessons.map((l) => (l.id === lesson.id ? { ...l, completed: true } : l)));
  };

  if (error) return <p className="error">{error}</p>;
  if (lessons.length === 0) return <p className="muted">This course has no lessons yet.</p>;

  const embed = toEmbed(lesson?.videoUrl);

  return (
    <div className="learn">
      <aside className="sidebar">
        <div className="progress"><div style={{ width: `${pct}%` }} /></div>
        <p className="small">{pct}% complete</p>
        {lessons.map((l) => (
          <button key={l.id} className={`lesson-item ${l.id === current ? 'active' : ''}`}
                  onClick={() => setCurrent(l.id)}>
            {l.completed ? '✅' : '⚪'} {l.position}. {l.title}
          </button>
        ))}
      </aside>
      <section className="lesson-view">
        <h2>{lesson.title}</h2>
        {embed && <iframe title="video" src={embed} width="100%" height="360" allowFullScreen />}
        {!embed && lesson.videoUrl && <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Open video ↗</a>}
        <p style={{ whiteSpace: 'pre-wrap' }}>{lesson.content}</p>
        {lesson.completed
          ? <p className="success">Lesson completed ✔</p>
          : <button className="btn" onClick={complete}>Mark as complete</button>}
      </section>
    </div>
  );
}
