package com.example.Backend.controller;

import com.example.Backend.model.Student;
import com.example.Backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.Backend.exception.ResourceNotFoundException; 
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

     @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return ResponseEntity.ok(student);
    }

  @PutMapping("/{id}")
public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Map<String, String> updates) {
    try {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Update only provided fields
        if (updates.containsKey("email")) {
            student.setEmail(updates.get("email"));
        }
        if (updates.containsKey("mobile")) {
            student.setMobile(updates.get("mobile"));
        }
        if (updates.containsKey("dob")) {
            student.setDob(updates.get("dob"));
        }
        
        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(updatedStudent);
        
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating student: " + e.getMessage());
    }
}


  @PostMapping("/login")
public ResponseEntity<?> loginStudent(@RequestBody Map<String, String> credentials) {
    try {
        String regno = credentials.get("regno");
        String password = credentials.get("password");
        
        if (regno == null || password == null) {
            return ResponseEntity.badRequest().body("Registration number is required in both fields");
        }
        
        // Verify both fields contain the same registration number
        if (!regno.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Registration numbers must match");
        }
        
        // Find student by regno
        Optional<Student> studentOpt = studentRepository.findByRegno(regno.trim());
        
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Student not found");
        }
        
        Student student = studentOpt.get();
        return ResponseEntity.ok(student);
        
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}