package com.example.demo.service;

import com.example.demo.model.BipNotification;
import com.example.demo.model.User;
import com.example.demo.repository.BipNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BipNotificationService {

    private final BipNotificationRepository repository;

    public BipNotification sendNotification(User user, String message) {

        BipNotification notification = new BipNotification();
        notification.setNotificationId("N-" + System.currentTimeMillis());
        notification.setUser(user);
        notification.setChannel("BiP");
        notification.setMessage(message);
        notification.setSentAt(Instant.now());

        return repository.save(notification);
    }

    public List<BipNotification> getAll() {
        return repository.findAll();
    }
}
