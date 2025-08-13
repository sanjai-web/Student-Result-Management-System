package com.example.Backend.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


import jakarta.persistence.*;

@Entity
public class ResultItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "result_id")
    @JsonBackReference
    private Result result;
    
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
    private String grade;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Result getResult() { return result; }
    public void setResult(Result result) { this.result = result; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}