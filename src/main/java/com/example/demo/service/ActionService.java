package com.example.demo.service;

import com.example.demo.model.FraudCase;
import com.example.demo.model.User;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final FraudCaseRepository fraudCaseRepository;

    public void handleAction(SelActionType action, User user) {

        if (action == SelActionType.OPEN_FRAUD_CASE) {
            FraudCase fraudCase = FraudCase.builder()
                    .caseId(UUID.randomUUID().toString())
                    .user(user)
                    .openedAt(Instant.now())
                    .build();

            fraudCaseRepository.save(fraudCase);
        }
    }
}
