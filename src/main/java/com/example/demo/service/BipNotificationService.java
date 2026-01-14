package com.example.demo.service;

import com.example.demo.model.BipNotification;
import com.example.demo.model.User;
import com.example.demo.repository.BipNotificationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BipNotificationService {

    private final BipNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public BipNotificationService(BipNotificationRepository notificationRepository,
                                  UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public BipNotification sendNotification(String userId, String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BipNotification notification = new BipNotification();
        notification.setNotificationId("N-" + System.currentTimeMillis());
        notification.setUser(user);
        notification.setChannel("BiP");
        notification.setMessage(message);
        notification.setSentAt(Instant.now());

        return notificationRepository.save(notification);
    }

    public List<BipNotification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}