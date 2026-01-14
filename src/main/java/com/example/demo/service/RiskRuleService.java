package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.repository.RiskRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskRuleService {

    private final RiskRuleRepository repository;
    private final RiskProfileService riskProfileService;
    private final DecisionService decisionService;
    private final ActionService actionService;

    public List<RiskRule> getAll() {
        return repository.findAll();
    }

    public RiskRule create(RiskRule rule) {
        return repository.save(rule);
    }

    public RiskRule update(String id, RiskRule rule) {
        rule.setRuleId(id);
        return repository.save(rule);
    }

    /**
     * EVENT GELDİKTEN SONRA RISK KURALLARINI DEĞERLENDİRİR
     */
    public void evaluate(User user, Event event) {

        // 1️⃣ Aktif kuralları priority sırasına göre al
        List<RiskRule> rules =
                repository.findByIsActiveTrueOrderByPriorityAsc();

        List<RiskRule> triggered = new ArrayList<>();

        // 2️⃣ Kural tetikleme (ENUM–ENUM karşılaştırma)
        for (RiskRule rule : rules) {
            if (event.getMeta() != null
                    && rule.getCondition() != null
                    && event.getMeta().equals(rule.getCondition())) {
                triggered.add(rule);
            }
        }


        // 3️⃣ Hiç kural tetiklenmediyse çık
        if (triggered.isEmpty()) {
            return;
        }

        // 4️⃣ En yüksek öncelikli kural (ilk eleman)
        RiskRule selectedRule = triggered.get(0);

        // 5️⃣ Decision (audit log)
        decisionService.logDecision(
                user,
                triggered,
                SelActionType.valueOf(selectedRule.getAction().name())
        );

        // 6️⃣ Risk profile güncelle
        riskProfileService.updateRisk(user, triggered);

        // 7️⃣ Aksiyon uygula
        actionService.handleAction(
                SelActionType.valueOf(selectedRule.getAction().name()),
                user
        );
    }
}
