package com.example.demo.service;

import com.example.demo.model.CaseAction;
import com.example.demo.model.FraudCase;
import com.example.demo.model.User;
import com.example.demo.model.enums.CasePriority;
import com.example.demo.model.enums.CaseStatus;
import com.example.demo.model.enums.Opened_by;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.repository.CaseActionRepository;
import com.example.demo.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FraudCaseService {

    private final FraudCaseRepository fraudCaseRepository;
    private final CaseActionRepository caseActionRepository;

    /* ================= FRAUD CASE ================= */

    public FraudCase openCase(
            User user,
            CasePriority priority,
            String caseType,
            Opened_by openedBy
    ) {

        FraudCase fraudCase = FraudCase.builder()
                .caseId(UUID.randomUUID().toString())
                .user(user)
                .priority(priority)
                .caseType(caseType)
                .openedBy(openedBy)
                .status(CaseStatus.OPEN)
                .openedAt(Instant.now())
                .build();

        return fraudCaseRepository.save(fraudCase);
    }

    public FraudCase getById(String caseId) {
        return fraudCaseRepository.findById(caseId)
                .orElseThrow(() ->
                        new RuntimeException("FraudCase not found: " + caseId)
                );
    }

    public List<FraudCase> getByUser(String userId) {
        return fraudCaseRepository.findByUser_UserId(userId);
    }

    /* ================= ACTION ================= */

    public void handleAction(
            SelActionType actionType,
            User user,
            String note
    ) {

        // 1️⃣ Kullanıcıya ait açık fraud case bul
        FraudCase fraudCase = getByUser(user.getUserId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No active fraud case for user: " + user.getUserId())
                );

        // 2️⃣ Action oluştur
        CaseAction action = CaseAction.builder()
                .actionId(UUID.randomUUID().toString())
                .fraudCase(fraudCase)
                .actionType(actionType)
                .actor(Opened_by.SYSTEM)
                .note(note)
                .timestamp(Instant.now())
                .build();

        // 3️⃣ Kaydet
        caseActionRepository.save(action);

        // 4️⃣ (ileride) gerçek aksiyonlar
        // BLOCK_USER, FORCE_2FA, PAYMENT_REVIEW
    }
}
