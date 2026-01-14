package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import com.example.demo.model.User;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Table(name = "bip_notifications")
public class BipNotification {

    @Id
    @Column(name = "notification_id")
    private String notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String channel;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Instant sentAt;

    // getters & setters
}

