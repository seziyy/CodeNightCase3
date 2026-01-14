package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.repository.RiskRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RiskEngineService {

    @Autowired
    private  RiskRuleRepository ruleRepository;

    @Autowired
    private  RiskProfileService riskProfileService;
    @Autowired
    private  DecisionService decisionService;
    @Autowired
    private  FraudCaseService fraudCaseService;
    @Autowired
    private  BipNotificationService notificationService;



    public void evaluate(User user, Event event) {

        // 1️⃣ Aktif kuralları çek
        List<RiskRule> rules =
                ruleRepository.findByIsActiveTrueOrderByPriorityAsc();

        List<RiskRule> triggered = new ArrayList<>();

        // 2️⃣ Basit rule evaluation (demo amaçlı)
        for (RiskRule rule : rules) {
            if (event.getMeta() != null
                    && rule.getCondition() != null
                    && rule.getCondition().contains("crypto")
                    && event.getMeta().contains("Crypto")) {

                triggered.add(rule);
            }
        }

        // 3️⃣ Hiç kural tetiklenmediyse çık
        if (triggered.isEmpty()) {
            return;
        }

        // 4️⃣ En yüksek öncelikli kural
        RiskRule selected = triggered.get(0);

        List<String> suppressedActions = triggered.stream()
                .skip(1)
                .map(RiskRule::getAction)
                .toList();

        // 5️⃣ Decision logla
        decisionService.createDecision(
                user.getUserId(),
                triggered.stream()
                        .map(RiskRule::getRuleId)
                        .toList()
                        .toString(),
                selected.getAction(),
                suppressedActions.toString()
        );

        // 6️⃣ Risk profile güncelle
        riskProfileService.updateRisk(
                user.getUserId(),
                triggered
        );

        // 7️⃣ Fraud case aç
        if ("OPEN_FRAUD_CASE".equals(selected.getAction())) {
            fraudCaseService.openCase(
                    user.getUserId(),
                    "AUTO_FRAUD",
                    "HIGH"
            );
        }

        // 8️⃣ Kullanıcıya bildirim gönder
        notificationService.sendNotification(
                user.getUserId(),
                "Risk Action Triggered: " + selected.getAction()
        );
    }
}
