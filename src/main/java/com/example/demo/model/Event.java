package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "events")

public class Event {



        @Id
        @Column(name = "event_id")
        private String eventId;

        @ManyToOne
        @JoinColumn(name = "user_id")
        private User user;

        private String service;
        private String eventType;
        private Double value;
        private String unit;

        @Column(columnDefinition = "TEXT")
        private String meta;

        private Instant timestamp;

        // getters & setters
    }
