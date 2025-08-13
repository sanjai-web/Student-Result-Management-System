package com.example.Backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String batchYear;
    private String year;
    private String semester;
    private String department; // Add this field with getters/setters
     
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "class_entity_id") 
    private List<Student> students;

        
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchYear() { return batchYear; }
    public void setBatchYear(String batchYear) { this.batchYear = batchYear; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public List<Student> getStudents() { return students; }
    public void setStudents(List<Student> students) { this.students = students; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}