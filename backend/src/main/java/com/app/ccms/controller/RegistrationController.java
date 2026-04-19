package com.app.ccms.controller;

import com.app.ccms.service.RegistrationService;
import com.app.ccms.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserService userService ;

    public RegistrationController(RegistrationService registrationService , UserService userService){
        this.registrationService = registrationService ;
        this.userService = userService ;
    }

    @PostMapping("/registrations/{eventId}")
    public ResponseEntity<Map<String,String>>  registerEvent(@PathVariable UUID eventId, @AuthenticationPrincipal UserDetails userDetails){
        try {
            Map<String,String> response = registrationService.registerEvent(eventId,userService.getUserByEmail(userDetails.getUsername()).getId() );
            return ResponseEntity.ok(response);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/registrations/me")
    public ResponseEntity<Map<String, Object>> getMyRegistrations(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Map<String, Object> response = registrationService.getMyRegistrations(userService.getUserByEmail(userDetails.getUsername()).getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

}
