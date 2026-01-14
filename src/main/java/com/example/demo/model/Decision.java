package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import com.example.demo.model.User;
import java.time.Instant;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "decision_logs")

public class Decision {


    @Id
    @Column(name = "decision_id")
    private String decisionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String triggeredRules;

    private String selectedAction;

    @Column(columnDefinition = "TEXT")
    private String suppressedActions;

    private Instant timestamp;

    // getters & setters
}