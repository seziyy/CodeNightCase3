package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    @Autowired
    private  UserService userService;
    private final RiskEngineService riskEngineService;

    public Event ingest(Event event) {

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
