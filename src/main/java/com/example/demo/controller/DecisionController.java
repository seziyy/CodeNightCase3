package com.example.demo.controller;

import com.example.demo.model.Decision;
import com.example.demo.repository.DecisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/decisions")
@RequiredArgsConstructor
public class DecisionController {

    private final DecisionRepository repository;

    @GetMapping
    public List<Decision> getAll() {
        return repository.findAll();
    }
}
