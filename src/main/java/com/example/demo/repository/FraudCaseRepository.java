package com.example.demo.repository;

import com.example.demo.model.FraudCase;
import com.example.demo.model.enums.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FraudCaseRepository extends JpaRepository<FraudCase, String> {

    List<FraudCase> findByUser_UserId(String userId);
    
    long countByStatus(CaseStatus status);
}
