package com.app.ccms.service;

import com.app.ccms.DTO.RegistrationDTO;
import com.app.ccms.model.Event;
import com.app.ccms.model.Registration;
import com.app.ccms.model.User;
import com.app.ccms.repository.EventRepository;
import com.app.ccms.repository.RegistrationRepository;
import com.app.ccms.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository ;
    private  final UserRepository userRepository ;
    private final EventRepository eventRepository ;

    public RegistrationService(
            RegistrationRepository registrationRepository , UserRepository userRepository, EventRepository eventRepository){
        this.registrationRepository = registrationRepository ;
        this.userRepository = userRepository ;
        this.eventRepository = eventRepository ;
    }

    @Transactional
    public Map<String, String> registerEvent(UUID eventId, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        
        Registration registration = registrationRepository.findRegistrationByUser_IdAndEvent_Id(userId, eventId);
        if (registration != null) {
            throw new RuntimeException("User already registered for this event");
        }
        if(registrationRepository.countByEvent_Id(eventId) >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }
        registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registrationRepository.save(registration);
        return Map.of("message", "Registration successful");
    }

    public Map<String, Object> getMyRegistrations(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        List<Registration> registrationList = registrationRepository.findAllByUser_Id(id);
        List<RegistrationDTO> registrationDTOS = new ArrayList<>() ;
        for(Registration registration : registrationList){
            Event event = registration.getEvent() ;
            RegistrationDTO registrationDTO = new RegistrationDTO();
            registrationDTO.setEventId(event.getId());
            registrationDTO.setEventTitle(event.getTitle());
            registrationDTO.setCategory(event.getCategory());
            registrationDTO.setVenue(event.getVenue());
            registrationDTO.setEventDateTime(event.getEventDateTime());
            registrationDTO.setRegisteredAt(registration.getRegisteredAt());
            registrationDTOS.add(registrationDTO) ;
        }
        return Map.of("registrations",registrationDTOS) ;
    }


}
