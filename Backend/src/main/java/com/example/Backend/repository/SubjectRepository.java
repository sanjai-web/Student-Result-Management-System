package com.example.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Backend.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}