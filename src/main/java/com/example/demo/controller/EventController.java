package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    @Autowired
    private  EventService eventService;

    @PostMapping
    public Event ingestEvent(@RequestBody Event event) {
        return eventService.ingest(event);
    }
}
