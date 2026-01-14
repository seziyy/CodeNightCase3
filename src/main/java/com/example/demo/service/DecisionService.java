package com.example.demo.service;

import com.example.demo.model.Decision;
import com.example.demo.model.User;
import com.example.demo.repository.DecisionRepository;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.List;

@Service
public class DecisionService {

    private final DecisionRepository repository;

    public DecisionService(DecisionRepository repository) {
        this.repository = repository;
    }

    public void logDecision(User user,
                            List<String> triggered,
                            String selected,
                            List<String> suppressed) {

        Decision d = new Decision();
        d.setDecisionId("D-" + System.currentTimeMillis());
        d.setUser(user);
        d.setTriggeredRules(triggered.toString());
        d.setSelectedAction(selected);
        d.setSuppressedActions(suppressed.toString());
        d.setTimestamp(Instant.now());

        repository.save(d);
    }

    public List<Decision> getAll() {
        return repository.findAll();
    }
}
