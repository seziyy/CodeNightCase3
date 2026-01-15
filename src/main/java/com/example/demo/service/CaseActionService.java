package com.example.demo.service;

import com.example.demo.model.CaseAction;
import com.example.demo.model.FraudCase;
import com.example.demo.model.User;
import com.example.demo.model.enums.Opened_by;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.repository.CaseActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaseActionService {

    private final CaseActionRepository caseActionRepository;
    private final FraudCaseService fraudCaseService;

    public CaseAction addAction(FraudCase fraudCase,
                                SelActionType actionType,
                                Opened_by actor,
                                String note) {

        CaseAction action = CaseAction.builder()
                .actionId(UUID.randomUUID().toString())
                .fraudCase(fraudCase)
                .actionType(actionType)
                .actor(actor)
                .note(note)
                .timestamp(Instant.now())
                .build();

        return caseActionRepository.save(action);
    }

    public List<CaseAction> getActionsByCase(String caseId) {
        return caseActionRepository.findByFraudCase_CaseId(caseId);
    }

    public CaseAction handleAction(SelActionType actionType,
                                   User user,
                                   String note) {

        FraudCase fraudCase = fraudCaseService.getByUser(user.getUserId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No active fraud case for user: " + user.getUserId())
                );

        return addAction(
                fraudCase,
                actionType,
                Opened_by.SYSTEM,
                note
        );
    }
}

