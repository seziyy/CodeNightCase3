package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.enums.SelActionType;
import com.example.demo.service.ActionService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/actions")
@RequiredArgsConstructor
public class ActionController {

    private final ActionService actionService;
    private final UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> triggerAction(
            @PathVariable String userId,
            @RequestParam SelActionType actionType
    ) {
        User user = userService.getUserById(userId);
        actionService.handleAction(actionType, user);
        return ResponseEntity.ok().build();
    }
}
