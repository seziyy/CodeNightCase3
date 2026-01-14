package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import com.example.demo.model.User;
@Entity
@Table(name = "risk_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskProfile {


    @Id
    @Column(name = "user_id")
    private String userId;

    private int riskScore;
    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String signals;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    // getters & setters
}
