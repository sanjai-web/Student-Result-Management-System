package com.example.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Backend.model.ClassEntity;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
}