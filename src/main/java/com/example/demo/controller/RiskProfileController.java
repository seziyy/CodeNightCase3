package com.example.demo.controller;

import com.example.demo.model.RiskProfile;
import com.example.demo.service.RiskProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/{id}/risk-profile")
@RequiredArgsConstructor
public class RiskProfileController {

    private final RiskProfileService service;

    @GetMapping
    public RiskProfile get(@PathVariable String id) {
        return service.getByUserId(id);
    }
}
