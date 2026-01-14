package com.example.demo.repository;

import com.example.demo.model.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, String> {
}
