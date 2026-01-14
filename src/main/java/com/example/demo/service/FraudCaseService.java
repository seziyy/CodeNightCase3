package com.example.demo.service;

import com.example.demo.model.FraudCase;
import com.example.demo.model.User;
import com.example.demo.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FraudCaseService {
    @Autowired
    private  FraudCaseRepository repository;

    public FraudCase openCase(User user, String type, String priority) {

        FraudCase fc = new FraudCase();
        fc.setCaseId("FC-" + System.currentTimeMillis());
        fc.setUser(user);
        fc.setOpenedBy("SYSTEM");
        fc.setCaseType(type);
        fc.setStatus("OPEN");
        fc.setPriority(priority);
        fc.setOpenedAt(Instant.now());

        return repository.save(fc);
    }

    public List<FraudCase> getAll() {
        return repository.findAll();
    }
}
