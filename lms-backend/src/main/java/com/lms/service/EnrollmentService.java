package com.lms.service;

import com.lms.dto.Dtos.EnrolledCourseResponse;
import com.lms.entity.*;
import com.lms.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository progressRepository;
    private final CourseService courseService;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             LessonRepository lessonRepository,
                             LessonProgressRepository progressRepository,
                             CourseService courseService) {
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
        this.courseService = courseService;
    }


    public void enroll(Long courseId, User student) {
        Course course = courseService.getCourse(courseId);
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already enrolled");
        }
        Enrollment e = new Enrollment();
        e.setStudent(student);
        e.setCourse(course);
        enrollmentRepository.save(e);
    }

    public List<EnrolledCourseResponse> myCourses(User student) {
        return enrollmentRepository.findByStudentId(student.getId()).stream().map(e -> {
            Course c = e.getCourse();
            int total = (int) lessonRepository.countByCourseId(c.getId());
            long done = progressRepository.countByStudentIdAndLessonCourseId(student.getId(), c.getId());
            int pct = total == 0 ? 0 : (int) (done * 100 / total);
            return new EnrolledCourseResponse(courseService.toResponse(c), done, total, pct);
        }).toList();
    }

    public void markComplete(Long lessonId, User student) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        if (!enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), lesson.getCourse().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not enrolled in this course");
        }
        if (!progressRepository.existsByStudentIdAndLessonId(student.getId(), lessonId)) {
            LessonProgress p = new LessonProgress();
            p.setStudent(student);
            p.setLesson(lesson);
            progressRepository.save(p);
        }
    }
}
