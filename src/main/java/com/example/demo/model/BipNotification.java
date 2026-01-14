package com.example.demo.model;

import com.example.demo.model.enums.ServiceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType channel;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Instant sentAt;

    // getters & setters
}

