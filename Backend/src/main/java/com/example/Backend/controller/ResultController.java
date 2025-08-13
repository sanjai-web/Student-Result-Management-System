package com.example.Backend.controller;

import com.example.Backend.model.*;
import com.example.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @PostMapping
    public Result createResult(@RequestBody ResultRequest resultRequest) {
        // Find student and teacher
        Student student = studentRepository.findById(resultRequest.getStudentId())
        .orElseThrow(() -> new RuntimeException("Student not found"));
    Teacher teacher = teacherRepository.findById(resultRequest.getTeacherId())
        .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Create result
        Result result = new Result();
    result.setStudent(student);
    result.setTeacher(teacher);
    result.setPublishedDate(new Date());
    result.setSemester(resultRequest.getSemester()); // Add this line
        // Create result items
        List<ResultItem> items = new ArrayList<>();
        for (ResultItemRequest itemRequest : resultRequest.getItems()) {
            Subject subject = subjectRepository.findById(itemRequest.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
            
            ResultItem item = new ResultItem();
            item.setSubject(subject);
            item.setGrade(itemRequest.getGrade());
            item.setResult(result);
            items.add(item);
        }

        result.setItems(items);
        return resultRepository.save(result);
    }


@GetMapping("/student/{studentId}")
public List<Result> getResultsByStudent(@PathVariable Long studentId) {
    List<Result> results = resultRepository.findByStudentId(studentId);
    
    // This ensures the subject data is loaded with each result item
    for (Result result : results) {
        for (ResultItem item : result.getItems()) {
            // This will force Hibernate to load the subject data
            item.getSubject().getName(); 
        }
    }
    
    return results;
}
    // Add other endpoints as needed
}

// Request DTO classes
class ResultRequest {
    private Long studentId;
    private Long teacherId;
     private String semester;
    private List<ResultItemRequest> items;

    // Getters and setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public List<ResultItemRequest> getItems() { return items; }
    public void setItems(List<ResultItemRequest> items) { this.items = items; }
     public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}

class ResultItemRequest {
    private Long subjectId;
    private String grade;

    // Getters and setters
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}