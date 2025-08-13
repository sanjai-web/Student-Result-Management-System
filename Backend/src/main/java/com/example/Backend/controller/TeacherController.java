package com.example.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Backend.model.Teacher;
import com.example.Backend.repository.TeacherRepository;
import com.example.Backend.util.PasswordEncoderUtil;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoderUtil passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> loginTeacher(@RequestBody LoginRequest loginRequest) {
        Optional<Teacher> teacher = teacherRepository.findByStaffId(loginRequest.getStaffId());
        
        if (teacher.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), teacher.get().getPassword())) {
            return ResponseEntity.ok(teacher.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        return teacherRepository.save(teacher);
    }

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    private static class LoginRequest {
        private String staffId;
        private String password;

        public String getStaffId() { return staffId; }
        public void setStaffId(String staffId) { this.staffId = staffId; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}