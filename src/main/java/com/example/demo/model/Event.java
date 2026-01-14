package com.example.demo.model;

import com.example.demo.model.enums.EventType;
import com.example.demo.model.enums.ServiceType;
import com.example.demo.model.enums.UnitType;
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

        // CASE FORMAT: user_id string
        @Column(name = "user_id", nullable = false)
        private String userId;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private ServiceType service;

        @Enumerated(EnumType.STRING)
        @Column(name = "event_type", nullable = false)
        private EventType eventType;

        private Double value;

        @Enumerated(EnumType.STRING)
        private UnitType unit;

        // CASE FORMAT: merchant=CryptoExchange
        @Column(columnDefinition = "TEXT", nullable = false)
        private String meta;

        @Column(nullable = false)
        private Instant timestamp;
}
