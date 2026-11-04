package com.lms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Dtos {
    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String role) {}

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, String role) {}

    public record CourseRequest(@NotBlank String title, String description, String category) {}

    public record LessonRequest(@NotBlank String title, String content, String videoUrl) {}

    public record CourseResponse(Long id, String title, String description, String category,
                                 String instructorName, int lessonCount) {}

    public record LessonResponse(Long id, String title, String content, String videoUrl,
                                 int position, boolean completed) {}

    public record EnrolledCourseResponse(CourseResponse course, long completedLessons,
                                         int totalLessons, int progress) {}
}
