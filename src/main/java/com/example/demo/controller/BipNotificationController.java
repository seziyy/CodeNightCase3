package com.example.demo.controller;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.model.BipNotification;
import com.example.demo.model.User;
import com.example.demo.service.BipNotificationService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BipNotificationController {

    private final BipNotificationService notificationService;
    private final UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<NotificationResponse> send(
            @PathVariable String userId,
            @RequestParam String message
    ) {
        User user = userService.getById(userId);
        return ResponseEntity.ok(notificationService.send(user, message));
    }

    @GetMapping
    public ResponseEntity<List<BipNotification>> getAll() {
        return ResponseEntity.ok(notificationService.getAll());
    }
}
