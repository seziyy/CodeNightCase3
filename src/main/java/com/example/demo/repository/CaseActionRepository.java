package com.example.demo.repository;

import com.example.demo.model.CaseAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseActionRepository extends JpaRepository<CaseAction, String> {

    List<CaseAction> findByFraudCase_CaseId(String caseId);
}
