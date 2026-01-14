package com.example.demo.controller;

import com.example.demo.model.RiskProfile;
import com.example.demo.model.User;
import com.example.demo.service.RiskProfileService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/risk-profiles")
public class RiskProfileController {

    @Autowired
    private  RiskProfileService riskProfileService;
    @Autowired
    private  UserService userService;


    @GetMapping("/{userId}")
    public RiskProfile getRiskProfile(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return riskProfileService.getOrCreate(user);
    }
}
