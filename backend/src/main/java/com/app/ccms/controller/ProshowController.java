package com.app.ccms.controller;

import com.app.ccms.model.ProShow;
import com.app.ccms.service.ProshowService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.app.ccms.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ProshowController {

    private final ProshowService proshowService;
    private final UserService userService;

    public ProshowController(ProshowService proshowService, UserService userService) {
        this.proshowService = proshowService;
        this.userService = userService;
    }

    @GetMapping("/proshows")
    public ResponseEntity<Map<String, Object>> getAllProshows() {
        return ResponseEntity.ok(proshowService.getAllProshows());
    }

    @GetMapping("/proshows/{proshowId}")
    public ResponseEntity<Map<String, Object>> getProshow(@PathVariable UUID proshowId) {
        ProShow proshow = proshowService.getProshowById(proshowId);
        if (proshow != null) {
            return ResponseEntity.ok(Map.of("proshow", proshow));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/proshows")
    public ResponseEntity<Map<String, String>> createProshow(@RequestBody ProShow newProshow) {
        try {
            return ResponseEntity.ok(proshowService.createProshow(newProshow));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/proshows/{proshowId}")
    public ResponseEntity<Map<String, String>> updateProshow(@PathVariable UUID proshowId, @RequestBody ProShow newProshow) {
        try {
            return ResponseEntity.ok(proshowService.updateProshow(proshowId, newProshow));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/proshows/{proshowId}")
    public ResponseEntity<Map<String, String>> deleteProshow(@PathVariable UUID proshowId) {
        try {
            return ResponseEntity.ok(proshowService.deleteProshow(proshowId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/proshows/{proshowId}/register")
    public ResponseEntity<Map<String, String>> registerForProshow(@PathVariable UUID proshowId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            }
            UUID userId = userService.getUserByEmail(userDetails.getUsername()).getId();
            return ResponseEntity.ok(proshowService.registerForProshow(proshowId, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/proshows/me")
    public ResponseEntity<Map<String, Object>> getMyProshowRegistrations(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            }
            UUID userId = userService.getUserByEmail(userDetails.getUsername()).getId();
            return ResponseEntity.ok(proshowService.getMyProshowRegistrations(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
