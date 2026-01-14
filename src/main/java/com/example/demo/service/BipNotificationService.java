package com.example.demo.service;

import com.example.demo.model.BipNotification;
import com.example.demo.model.User;
import com.example.demo.model.enums.NotificationChannel;
import com.example.demo.model.enums.ServiceType;
import com.example.demo.repository.BipNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BipNotificationService {

    private final BipNotificationRepository repository;

    public BipNotification send(User user, String message) {

        BipNotification notification = BipNotification.builder()
                .notificationId(UUID.randomUUID().toString())
                .user(user)
                .channel(ServiceType.BIP)
                .message(message)
                .sentAt(Instant.now())
                .build();

        return repository.save(notification);
    }

    public List<BipNotification> getAll() {
        return repository.findAll();
    }
}
