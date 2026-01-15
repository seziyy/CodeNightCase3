package com.example.demo.controller;

import com.example.demo.model.CaseAction;
import com.example.demo.model.User;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.service.CaseActionService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ActionController {

    private final CaseActionService caseActionService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CaseAction> triggerAction(@RequestParam SelActionType actionType,
                                                    @RequestParam String userId,
                                                    @RequestParam(required = false) String note) {

        User user = userService.getById(userId);

        CaseAction action = caseActionService.handleAction(
                actionType,
                user,
                note != null ? note : "Manual action triggered"
        );

        return ResponseEntity.ok(action);
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<CaseAction>> getActionsByCase(@PathVariable String caseId) {
        return ResponseEntity.ok(caseActionService.getActionsByCase(caseId));
    }
}
