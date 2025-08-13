package com.example.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Backend.model.ClassEntity;
import com.example.Backend.model.Student;
import com.example.Backend.repository.ClassRepository;
import com.example.Backend.repository.StudentRepository;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<ClassEntity> getAllClasses() {
        return classRepository.findAll();
    }

    @PostMapping
    public ClassEntity createClass(@RequestBody ClassEntity classEntity) {
        ClassEntity savedClass = classRepository.save(classEntity);
        
        // Update students' semester if students are provided
        if (savedClass.getStudents() != null && !savedClass.getStudents().isEmpty()) {
            updateStudentsSemester(savedClass);
        }
        
        return savedClass;
    }

    @PutMapping("/{id}")
    public ClassEntity updateClass(@PathVariable Long id, @RequestBody ClassEntity classDetails) {
        ClassEntity classEntity = classRepository.findById(id).orElseThrow();
        
        classEntity.setBatchYear(classDetails.getBatchYear());
        classEntity.setYear(classDetails.getYear());
        classEntity.setSemester(classDetails.getSemester());
        classEntity.setDepartment(classDetails.getDepartment());
        classEntity.setStudents(classDetails.getStudents());
        
        ClassEntity updatedClass = classRepository.save(classEntity);
        
        // Update students' semester if students are provided
        if (updatedClass.getStudents() != null && !updatedClass.getStudents().isEmpty()) {
            updateStudentsSemester(updatedClass);
        }
        
        return updatedClass;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        classRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    private void updateStudentsSemester(ClassEntity classEntity) {
        List<Student> students = classEntity.getStudents();
        String newSemester = classEntity.getSemester();
        
        for (Student student : students) {
            // Only update if semester is different
            if (!newSemester.equals(student.getSemester())) {
                student.setSemester(newSemester);
                studentRepository.save(student);
            }
        }
    }
}