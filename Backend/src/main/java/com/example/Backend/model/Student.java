package com.example.Backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String regno;
    private String email;
    private String mobile;
    private String department;
    private String studentBatchYear;
    private String dob;
    private String semester; // Add this field with getters/setters
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRegno() { return regno; }
    public void setRegno(String regno) { this.regno = regno; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getStudentBatchYear() { return studentBatchYear; }
    public void setStudentBatchYear(String studentBatchYear) { this.studentBatchYear = studentBatchYear; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}