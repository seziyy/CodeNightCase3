package com.example.demo.service;

import com.example.demo.model.RiskProfile;
import com.example.demo.model.RiskRule;
import com.example.demo.model.User;
import com.example.demo.model.enums.RiskLevel;
import com.example.demo.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskProfileService {

    private final RiskProfileRepository repository;

    public void updateRisk(User user, List<RiskRule> rules) {

        RiskProfile profile = repository.findById(user.getUserId())
                .orElse(new RiskProfile(
                        user.getUserId(),
                        0,
                        RiskLevel.LOW,
                        "",
                        user
                ));

        profile.setRiskScore(profile.getRiskScore() + rules.size() * 10);
        profile.setRiskLevel(
                profile.getRiskScore() > 70 ? RiskLevel.HIGH :
                        profile.getRiskScore() > 40 ? RiskLevel.MEDIUM :
                                RiskLevel.LOW
        );

        repository.save(profile);
    }

    public RiskProfile getByUserId(String userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Risk profile not found"));
    }
}
