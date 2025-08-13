package com.example.Backend.repository;

import com.example.Backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRegno(String regno);
}