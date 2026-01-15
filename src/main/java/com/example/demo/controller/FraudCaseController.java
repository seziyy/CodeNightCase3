package com.example.demo.controller;

import com.example.demo.model.FraudCase;
import com.example.demo.model.User;
import com.example.demo.model.enums.CasePriority;
import com.example.demo.model.enums.Opened_by;
import com.example.demo.service.FraudCaseService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fraud-cases")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FraudCaseController {

    private final FraudCaseService fraudCaseService;
    private final UserService userService;

    @PostMapping("/open")
    public ResponseEntity<FraudCase> openCase(@RequestParam String userId,
                                              @RequestParam CasePriority priority,
                                              @RequestParam String caseType) {

        User user = userService.getById(userId);

        FraudCase fraudCase = fraudCaseService.openCase(
                user,
                priority,
                caseType,
                Opened_by.SYSTEM
        );

        return ResponseEntity.ok(fraudCase);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FraudCase>> getCasesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(fraudCaseService.getByUser(userId));
    }
}
