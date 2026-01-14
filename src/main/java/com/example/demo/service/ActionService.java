package com.example.demo.service;

import com.example.demo.model.BipNotification;
import com.example.demo.model.RiskProfile;
import com.example.demo.model.User;
import com.example.demo.repository.BipNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final BipNotificationRepository bipNotificationRepository;
    @Autowired
    private  BipNotificationService notificationService;

    public void handleActions(RiskProfile profile) {

        if ("HIGH".equals(profile.getRiskLevel())) {

            User user = profile.getUser(); // ✅ entity ilişkisinden

            String message = "Güvenliğiniz için hesabınız izlemeye alınmıştır.";

            BipNotification notification = new BipNotification();
            notification.setNotificationId(UUID.randomUUID().toString());
            notification.setUser(user);
            notification.setChannel("BiP");
            notification.setMessage(message);
            notification.setSentAt(Instant.now());

            bipNotificationRepository.save(notification);

            notificationService.sendNotification(user.getUserId(), message);
        }
    }
}
