package com.example.demo.controller;

import com.example.demo.model.Decision;
import com.example.demo.service.DecisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/decisions")
@RequiredArgsConstructor
public class DecisionController {
    @Autowired
    private  DecisionService decisionService;

    @GetMapping
    public List<Decision> getAll() {
        return decisionService.getAll();
    }
}
