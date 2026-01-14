package com.example.demo.service;

import com.example.demo.model.Decision;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.repository.DecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DecisionService {

    private final DecisionRepository repository;

    public void logDecision(User user,
                            List<RiskRule> rules,
                            SelActionType selectedAction) {

        Decision decision = Decision.builder()
                .decisionId(UUID.randomUUID().toString())
                .user(user)
                .triggeredRules(
                        rules.stream()
                                .map(RiskRule::getRuleId)
                                .collect(Collectors.toList())
                                .toString()
                )
                .selectedAction(selectedAction)
                .timestamp(Instant.now())
                .build();

        repository.save(decision);
    }
}
