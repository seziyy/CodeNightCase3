package com.example.demo.controller;

import com.example.demo.model.RiskRule;
import com.example.demo.repository.RiskRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/risk-rules")
@RequiredArgsConstructor
public class RiskRuleController {

    @Autowired

    private  RiskRuleRepository repository;

    @GetMapping
    public List<RiskRule> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public RiskRule create(@RequestBody RiskRule rule) {
        return repository.save(rule);
    }

    @PutMapping("/{id}")
    public RiskRule update(@PathVariable String id,
                           @RequestBody RiskRule rule) {

        rule.setRuleId(id);
        return repository.save(rule);
    }
}
