package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "fraud_cases")

public class FraudCase {

    @Id
    @Column(name = "case_id")
    private String caseId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String openedBy;
    private String caseType;
    private String status;
    private String priority;

    private Instant openedAt;



    // getters & setters
}