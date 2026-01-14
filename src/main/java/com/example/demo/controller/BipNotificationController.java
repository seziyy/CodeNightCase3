package com.example.demo.controller;

import com.example.demo.model.BipNotification;
import com.example.demo.service.BipNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class BipNotificationController {

    @Autowired
    private  BipNotificationService bipNotificationService;

    @GetMapping
    public List<BipNotification> getAll() {
        return bipNotificationService.getAll();
    }
}
