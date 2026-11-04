package com.lms.repository;

import com.lms.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    boolean existsByStudentIdAndLessonId(Long studentId, Long lessonId);
    long countByStudentIdAndLessonCourseId(Long studentId, Long courseId);
    List<LessonProgress> findByStudentIdAndLessonCourseId(Long studentId, Long courseId);
    void deleteByLessonCourseId(Long courseId);
}
