package com.example.demo.model;

import com.example.demo.model.enums.RiskLevel;
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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;


    @Column(columnDefinition = "TEXT")
    private String signals;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

}
