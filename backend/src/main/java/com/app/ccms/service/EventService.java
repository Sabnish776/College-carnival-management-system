package com.app.ccms.service;
import com.app.ccms.model.Event;
import com.app.ccms.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Map<String, Object> getAllEvents() {
        return Map.of("events",eventRepository.findAll()) ;
    }

    public Event getEventById(UUID eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    public Map<String,String> createEvent(Event newEvent) {
        Map<String,String> map = new HashMap<>();
        try {
            eventRepository.save(newEvent);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create event: " + e.getMessage());
        }
        map.put("message", "Event created successfully ");
        return map;
    }

    public Map<String, String> updateEvent(UUID eventId, Event newEvent) {
        Map<String,String> map = new HashMap<>();
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }
        try {
            if (newEvent.getTitle() != null) {
                event.setTitle(newEvent.getTitle());
            }
            if (newEvent.getDescription() != null) {
                event.setDescription(newEvent.getDescription());
            }
            if (newEvent.getEventDateTime() != null) {
                event.setEventDateTime(newEvent.getEventDateTime());
            }
            if (newEvent.getVenue() != null) {
                event.setVenue(newEvent.getVenue());
            }
            if (newEvent.getMaxParticipants() > 0) {
                event.setMaxParticipants(newEvent.getMaxParticipants());
            }
            if (newEvent.getCategory() != null) {
                event.setCategory(newEvent.getCategory());
            }
            eventRepository.save(event);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update event: " + e.getMessage());
        }
        map.put("message", "Event updated successfully");
        return map;
    }

    public Map<String, String> deleteEvent(UUID eventId) {
        Map<String,String> map = new HashMap<>();
        try {
            eventRepository.deleteById(eventId);
        }catch (Exception e) {
            throw new RuntimeException("Failed to delete event: " + e.getMessage());
        }
        map.put("message", "Event deleted successfully ");
        return map;
    }
}
