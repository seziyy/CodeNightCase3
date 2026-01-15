package com.example.demo.controller;

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
public class BipNotificationController {

    private final BipNotificationService notificationService;
    private final UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<BipNotification> send(
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
