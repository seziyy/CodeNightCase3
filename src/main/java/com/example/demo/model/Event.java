package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

        @Id
        @Column(name = "event_id")
        private String eventId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Column(nullable = false)
        private String service;

        @Column(name = "event_type", nullable = false)
        private String eventType;

        private Double value;

        private String unit;

        @Column(columnDefinition = "TEXT")
        private String meta;

        @Column(nullable = false)
        private Instant timestamp;
}
