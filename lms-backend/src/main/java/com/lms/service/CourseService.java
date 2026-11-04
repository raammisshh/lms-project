package com.lms.service;

import com.lms.dto.Dtos.*;
import com.lms.entity.Course;
import com.lms.entity.Lesson;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository progressRepository;

    public CourseService(CourseRepository courseRepository,
                         LessonRepository lessonRepository,
                         EnrollmentRepository enrollmentRepository,
                         LessonProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
    }


    public CourseResponse toResponse(Course c) {
        return new CourseResponse(c.getId(), c.getTitle(), c.getDescription(), c.getCategory(),
                c.getInstructor().getName(), (int) lessonRepository.countByCourseId(c.getId()));
    }

    public Course getCourse(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public List<CourseResponse> findAll(String q) {
        return courseRepository.findAll().stream()
                .filter(c -> q == null || q.isBlank() || c.getTitle().toLowerCase().contains(q.toLowerCase()))
                .map(this::toResponse).toList();
    }

    public CourseResponse findOne(Long id) {
        return toResponse(getCourse(id));
    }

    public List<CourseResponse> findByInstructor(User instructor) {
        return courseRepository.findByInstructorId(instructor.getId()).stream().map(this::toResponse).toList();
    }

    public CourseResponse create(CourseRequest req, User instructor) {
        Course c = new Course();
        c.setTitle(req.title());
        c.setDescription(req.description());
        c.setCategory(req.category());
        c.setInstructor(instructor);
        return toResponse(courseRepository.save(c));
    }

    public CourseResponse update(Long id, CourseRequest req, User user) {
        Course c = getOwnedCourse(id, user);
        c.setTitle(req.title());
        c.setDescription(req.description());
        c.setCategory(req.category());
        return toResponse(courseRepository.save(c));
    }

    @Transactional
    public void delete(Long id, User user) {
        Course c = getOwnedCourse(id, user);
        progressRepository.deleteByLessonCourseId(id);
        enrollmentRepository.deleteByCourseId(id);
        courseRepository.delete(c);
    }

    public LessonResponse addLesson(Long courseId, LessonRequest req, User user) {
        Course c = getOwnedCourse(courseId, user);
        Lesson l = new Lesson();
        l.setTitle(req.title());
        l.setContent(req.content());
        l.setVideoUrl(req.videoUrl());
        l.setPosition((int) lessonRepository.countByCourseId(courseId) + 1);
        l.setCourse(c);
        l = lessonRepository.save(l);
        return new LessonResponse(l.getId(), l.getTitle(), l.getContent(), l.getVideoUrl(), l.getPosition(), false);
    }

    public List<LessonResponse> getLessons(Long courseId, User user) {
        Course c = getCourse(courseId);
        if (user.getRole() == Role.STUDENT
                && !enrollmentRepository.existsByStudentIdAndCourseId(user.getId(), courseId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Enroll in this course to view lessons");
        }
        if (user.getRole() == Role.INSTRUCTOR && !c.getInstructor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your course");
        }
        Set<Long> done = progressRepository.findByStudentIdAndLessonCourseId(user.getId(), courseId).stream()
                .map(p -> p.getLesson().getId()).collect(Collectors.toSet());
        return lessonRepository.findByCourseIdOrderByPositionAsc(courseId).stream()
                .map(l -> new LessonResponse(l.getId(), l.getTitle(), l.getContent(), l.getVideoUrl(),
                        l.getPosition(), done.contains(l.getId())))
                .toList();
    }

    private Course getOwnedCourse(Long id, User user) {
        Course c = getCourse(id);
        if (user.getRole() != Role.ADMIN && !c.getInstructor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this course");
        }
        return c;
    }
}
