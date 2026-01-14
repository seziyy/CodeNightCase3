package com.example.demo.controller;

import com.example.demo.model.FraudCase;
import com.example.demo.service.FraudCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fraud-cases")
@RequiredArgsConstructor
public class FraudCaseController {

    @Autowired
    private  FraudCaseService fraudCaseService;

    public FraudCaseController(FraudCaseService fraudCaseService) {
        this.fraudCaseService = fraudCaseService;
    }

    @GetMapping
    public List<FraudCase> getAll() {
        return fraudCaseService.getAll();
    }
}
