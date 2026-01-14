package com.example.demo.service;

import com.example.demo.model.Decision;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.repository.DecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DecisionService {

    private final DecisionRepository repository;

    public void logDecision(
            User user,
            List<RiskRule> triggered,
            String selectedAction
    ) {

        Decision d = new Decision();
        d.setDecisionId("D-" + System.currentTimeMillis());
        d.setUser(user);

        d.setTriggeredRules(
                triggered.stream()
                        .map(RiskRule::getRuleId)
                        .collect(Collectors.toList())
                        .toString()
        );

        d.setSelectedAction(selectedAction);

        d.setSuppressedActions(
                triggered.stream()
                        .skip(1)
                        .map(RiskRule::getAction)
                        .collect(Collectors.toList())
                        .toString()
        );

        d.setTimestamp(Instant.now());

        repository.save(d);
    }

    public List<Decision> getAll() {
        return repository.findAll();
    }
}
