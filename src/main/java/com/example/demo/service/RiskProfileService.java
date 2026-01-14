package com.example.demo.service;

import com.example.demo.model.RiskProfile;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskProfileService {

    private final RiskProfileRepository repository;

    public RiskProfile getOrCreate(User user) {

        return repository.findById(String.valueOf(user.getUserId()))
                .orElseGet(() -> {
                    RiskProfile rp = new RiskProfile();
                    rp.setUser(user);
                    rp.setRiskScore(0);
                    rp.setRiskLevel("LOW");
                    return repository.save(rp);
                });
    }

    public void updateRisk(User user, List<RiskRule> rules) {

        RiskProfile rp = getOrCreate(user);

        rp.setRiskScore(
                Math.min(100, rp.getRiskScore() + 30)
        );

        rp.setRiskLevel(
                rp.getRiskScore() > 70 ? "HIGH" : "MEDIUM"
        );

        rp.setSignals(
                rules.stream()
                        .map(RiskRule::getRuleId)
                        .toList()
                        .toString()
        );

        repository.save(rp);
    }
}
