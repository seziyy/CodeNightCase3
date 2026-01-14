package com.example.demo.repository;

import com.example.demo.model.Decision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecisionRepository extends JpaRepository<Decision, String> {

}
