package com.example.Backend.repository;

import com.example.Backend.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    @Query("SELECT DISTINCT r FROM Result r " +
           "LEFT JOIN FETCH r.items i " +
           "LEFT JOIN FETCH i.subject " +
           "WHERE r.student.id = :studentId")
    List<Result> findByStudentId(@Param("studentId") Long studentId);
}