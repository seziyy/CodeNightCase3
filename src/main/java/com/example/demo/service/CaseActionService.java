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
public class ActionService {

    private final FraudCaseService fraudCaseService;
    private final CaseActionRepository caseActionRepository;

    /**
     * Sistem veya admin tarafından aksiyon tetiklenmesi
     */
    public CaseAction handleAction(SelActionType actionType, User user, String note) {

        // Kullanıcıya ait açık fraud case bul
        FraudCase fraudCase = fraudCaseService.getByUser(user.getUserId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No active fraud case for user: " + user.getUserId())
                );

        // Action kaydı oluştur
        CaseAction action = CaseAction.builder()
                .actionId(UUID.randomUUID().toString())
                .fraudCase(fraudCase)
                .actionType(actionType)
                .actor(Opened_by.SYSTEM)
                .note(note)
                .timestamp(Instant.now())
                .build();

        return caseActionRepository.save(action);
    }

    /**
     * Bir case'e ait tüm aksiyonları getir
     */
    public List<CaseAction> getActionsByCase(String caseId) {
        return caseActionRepository.findByFraudCase_CaseId(caseId);
    }
}
