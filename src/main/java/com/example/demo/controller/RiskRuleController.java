package com.example.demo.controller;

import com.example.demo.model.RiskRule;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.RiskRuleService;
import java.util.List;

@RestController
@RequestMapping("/risk-rules")
@RequiredArgsConstructor
public class RiskRuleController {

    @Autowired
    private RiskRuleService service;


    @GetMapping
    public List<RiskRule> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<RiskRule> create(@RequestBody RiskRule rule) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(rule));
    }

    @PutMapping("/{id}")
    public RiskRule update(@PathVariable String id,
                           @RequestBody RiskRule rule) {
        return service.update(id, rule);
    }
}
