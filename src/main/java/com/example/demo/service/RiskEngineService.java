package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.repository.RiskRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskEngineService {

    private final RiskRuleRepository ruleRepository;
    private final RiskProfileService riskProfileService;
    private final DecisionService decisionService;
    private final ActionService actionService;

    public void evaluate(User user, Event event) {

        List<RiskRule> rules =
                ruleRepository.findByIsActiveTrueOrderByPriorityAsc();

        List<RiskRule> triggered = rules.stream()
                .filter(r ->
                        event.getMeta() != null &&
                                r.getCondition() != null &&
                                r.getCondition().contains("crypto") &&
                                event.getMeta().contains("Crypto")
                )
                .toList();

        if (triggered.isEmpty()) return;

        RiskRule selected = triggered.get(0);

        decisionService.logDecision(
                user,
                triggered,
                selected.getAction()
        );

        riskProfileService.updateRisk(user, triggered);

        actionService.handleAction(
                selected.getAction(),
                user
        );
    }
}
