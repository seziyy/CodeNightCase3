package com.example.demo.controller;

import com.example.demo.repository.EventRepository;
import com.example.demo.repository.FraudCaseRepository;
import com.example.demo.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final EventRepository eventRepository;
    private final RiskProfileRepository riskProfileRepository;
    private final FraudCaseRepository fraudCaseRepository;

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {

        long totalEvents = eventRepository.count();
        long openFraudCases = fraudCaseRepository.count();

        // basit yaklaşım: HIGH riskli user sayısı
        long highRiskUsers = riskProfileRepository.findAll()
                .stream()
                .filter(p -> "HIGH".equals(p.getRiskLevel()))
                .count();

        return DashboardSummaryDTO.builder()
                .totalEvents(totalEvents)
                .highRiskUsers(highRiskUsers)
                .openFraudCases(openFraudCases)
                .build();
    }
}
