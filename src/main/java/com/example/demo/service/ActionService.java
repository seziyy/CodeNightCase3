package com.example.demo.service;

import com.example.demo.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final BipNotificationService notificationService;
    private final FraudCaseService fraudCaseService;

    public void handleAction(String action, User user) {

        switch (action) {
            case "FORCE_2FA" ->
                    notificationService.sendNotification(
                            user,
                            "Güvenliğiniz için ek doğrulama (2FA) zorunlu hale getirildi."
                    );

            case "OPEN_FRAUD_CASE" -> {
                fraudCaseService.openCase(
                        user,
                        "AUTO_FRAUD",
                        "HIGH"
                );
                notificationService.sendNotification(
                        user,
                        "Hesabınız güvenlik incelemesine alınmıştır."
                );
            }

            case "TEMPORARY_BLOCK" ->
                    notificationService.sendNotification(
                            user,
                            "Hesabınız geçici olarak bloke edilmiştir."
                    );
        }
    }
}
