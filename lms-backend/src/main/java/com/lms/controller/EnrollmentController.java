package com.lms.controller;

import com.lms.dto.Dtos.EnrolledCourseResponse;
import com.lms.entity.User;
import com.lms.service.EnrollmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('STUDENT')")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }


    @PostMapping("/courses/{id}/enroll")
    public void enroll(@PathVariable Long id, @AuthenticationPrincipal User user) {
        enrollmentService.enroll(id, user);
    }

    @GetMapping("/student/courses")
    public List<EnrolledCourseResponse> myCourses(@AuthenticationPrincipal User user) {
        return enrollmentService.myCourses(user);
    }

    @PostMapping("/lessons/{id}/complete")
    public void complete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        enrollmentService.markComplete(id, user);
    }
}
