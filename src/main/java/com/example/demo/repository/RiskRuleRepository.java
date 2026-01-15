package com.example.demo.repository;

import com.example.demo.model.RiskRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiskRuleRepository extends JpaRepository<RiskRule, String> {

    List<RiskRule> findByIsActiveTrueOrderByPriorityAsc();
    
    long countByIsActive(boolean isActive);
}
