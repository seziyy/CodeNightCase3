package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository repository;
    private final UserService userService;
    private final RiskRuleService riskRuleService;

    public Event create(Event event) {

        Event saved = repository.save(event);

        User user = userService.getById(event.getUserId());

        riskRuleService.evaluate(user, saved);

        return saved;
    }
}

