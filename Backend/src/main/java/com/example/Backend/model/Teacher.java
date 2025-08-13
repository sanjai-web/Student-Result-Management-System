package com.example.Backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String dept;
    private String password; // Stored as hashed value
    private String staffId;
    private String email;
    private String mobile;

    // Constructors
    public Teacher() {}

    public Teacher(String name, String dept, String password, String staffId, String email, String mobile) {
        this.name = name;
        this.dept = dept;
        this.password = password;
        this.staffId = staffId;
        this.email = email;
        this.mobile = mobile;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
}