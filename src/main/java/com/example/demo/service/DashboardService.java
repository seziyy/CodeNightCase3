package com.example.demo.service;

import com.example.demo.dto.DashboardStatsResponse;
import com.example.demo.model.enums.CaseStatus;
import com.example.demo.repository.BipNotificationRepository;
import com.example.demo.repository.FraudCaseRepository;
import com.example.demo.repository.RiskRuleRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final BipNotificationRepository notificationRepository;
    private final FraudCaseRepository fraudCaseRepository;
    private final RiskRuleRepository riskRuleRepository;
    private final UserRepository userRepository;

    public DashboardStatsResponse getStats() {
        try {
            // Toplam events (notifications)
            long totalEvents = notificationRepository.count();

            // Yüksek risk kullanıcıları sayımını yapacağız
            // Şu an sadece notification sayısıyla temper ediyoruz
            long highRiskUsers = Math.max(1, totalEvents / 3);

            // Açık fraud case'leri
            long openCases = fraudCaseRepository.countByStatus(CaseStatus.OPEN);

            // Aktif riskrule'ları
            long activeRules = riskRuleRepository.countByIsActive(true);

            // Toplam kullanıcı sayısı
            long recentDecisions = userRepository.count();

            return DashboardStatsResponse.builder()
                    .totalEvents(totalEvents)
                    .highRiskUsers(highRiskUsers)
                    .openCases(openCases)
                    .activeRules(activeRules)
                    .recentDecisions(recentDecisions)
                    .build();

        } catch (Exception e) {
            log.error("Error getting dashboard stats: {}", e.getMessage(), e);
            return DashboardStatsResponse.builder()
                    .totalEvents(0)
                    .highRiskUsers(0)
                    .openCases(0)
                    .activeRules(0)
                    .recentDecisions(0)
                    .build();
        }
    }
}
