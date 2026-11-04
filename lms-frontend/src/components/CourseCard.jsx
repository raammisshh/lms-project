import { Link } from 'react-router-dom';

export default function CourseCard({ course, children }) {
  return (
    <div className="card">
      <span className="tag">{course.category || 'General'}</span>
      <h3>{course.title}</h3>
      <p className="muted">{course.description?.slice(0, 90)}{course.description?.length > 90 ? '…' : ''}</p>
      <p className="small">By {course.instructorName} • {course.lessonCount} lessons</p>
      {children || <Link className="btn" to={`/courses/${course.id}`}>View</Link>}
    </div>
  );
}
