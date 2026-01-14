package com.example.demo.controller;

import com.example.demo.model.FraudCase;
import com.example.demo.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/fraud-cases")
@RequiredArgsConstructor
public class FraudCaseController {

    private final FraudCaseRepository fraudCaseRepository;

    @GetMapping
    public List<FraudCaseDTO> getAllCases() {

        return fraudCaseRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private FraudCaseDTO toDto(FraudCase fraudCase) {
        return FraudCaseDTO.builder()
                .caseId(fraudCase.getCaseId())
                .userId(fraudCase.getUser())
                .caseType(fraudCase.getCaseType())
                .status(fraudCase.getStatus())
                .priority(fraudCase.getPriority())
                .build();
    }
}
