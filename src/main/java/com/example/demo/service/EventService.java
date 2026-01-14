package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private RiskEngineService riskEngineService;


    public Event ingestEvent(Event event) {

        User user = userService.getUserById(
                event.getUser().getUserId()
        );

        event.setEventId("EV-" + System.currentTimeMillis());
        event.setUser(user);
        event.setTimestamp(Instant.now());

        Event saved = eventRepository.save(event);

        riskEngineService.evaluate(user, saved);

        return saved;
    }
}
