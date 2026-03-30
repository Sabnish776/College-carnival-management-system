package com.app.ccms.controller;

import com.app.ccms.model.Event;
import com.app.ccms.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/events")
    public ResponseEntity<Map<String, Object>> getAllEvents() {
        Map<String, Object> response = eventService.getAllEvents() ;
        return ResponseEntity.ok(response);
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<Map<String , Object>> getEvent(@PathVariable UUID eventId) {
        Event event = eventService.getEventById(eventId);
        if (event != null) {
            return ResponseEntity.ok(Map.of("event", event));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/events")
    public ResponseEntity<Map<String , String >> createEvent(@RequestBody Event newEvent) {
        try{
            Map<String,String> response = eventService.createEvent(newEvent);
            return  ResponseEntity.ok(response);
        }catch (Exception e) {
            return  ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/admin/events/{eventId}")
    public ResponseEntity<Map<String , String>> updateEvent(@PathVariable UUID eventId, @RequestBody Event newEvent) {
        try{
            Map<String , String> response = eventService.updateEvent(eventId,newEvent) ;
            return  ResponseEntity.ok(response);
        }catch (Exception e) {
            return  ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/events/{eventId}")
    public ResponseEntity<Map<String , String>> deleteEvent(@PathVariable UUID eventId) {
        try{
            Map<String,String> response = eventService.deleteEvent(eventId);
            return  ResponseEntity.ok(response);
        }catch (Exception e) {
            return  ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
