package com.example.demo.model;

import com.example.demo.model.enums.Opened_by;
import com.example.demo.model.enums.SelActionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "case_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseAction {

    @Id
    @Column(name = "action_id")
    private String actionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private FraudCase fraudCase;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private SelActionType actionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Opened_by actor;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private Instant timestamp;
}
