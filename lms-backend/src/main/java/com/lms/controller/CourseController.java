package com.lms.controller;

import com.lms.dto.Dtos.*;
import com.lms.entity.User;
import com.lms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    // ---- public ----
    @GetMapping("/courses")
    public List<CourseResponse> all(@RequestParam(required = false) String q) {
        return courseService.findAll(q);
    }

    @GetMapping("/courses/{id}")
    public CourseResponse one(@PathVariable Long id) {
        return courseService.findOne(id);
    }

    // ---- instructor / admin ----
    @GetMapping("/instructor/courses")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public List<CourseResponse> mine(@AuthenticationPrincipal User user) {
        return courseService.findByInstructor(user);
    }

    @PostMapping("/courses")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public CourseResponse create(@Valid @RequestBody CourseRequest req, @AuthenticationPrincipal User user) {
        return courseService.create(req, user);
    }

    @PutMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest req,
                                 @AuthenticationPrincipal User user) {
        return courseService.update(id, req, user);
    }

    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        courseService.delete(id, user);
    }

    @PostMapping("/courses/{id}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public LessonResponse addLesson(@PathVariable Long id, @Valid @RequestBody LessonRequest req,
                                    @AuthenticationPrincipal User user) {
        return courseService.addLesson(id, req, user);
    }

    // ---- any logged-in user (service checks enrollment/ownership) ----
    @GetMapping("/courses/{id}/lessons")
    public List<LessonResponse> lessons(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return courseService.getLessons(id, user);
    }
}
