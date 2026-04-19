package com.app.ccms.service;

import com.app.ccms.DTO.ProshowRegistrationDTO;
import com.app.ccms.model.ProShow;
import com.app.ccms.model.ProshowRegistration;
import com.app.ccms.model.User;
import com.app.ccms.repository.ProshowRegistrationRepository;
import com.app.ccms.repository.ProshowRepository;
import com.app.ccms.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProshowService {

    private final ProshowRepository proshowRepository;
    private final ProshowRegistrationRepository proshowRegistrationRepository;
    private final UserRepository userRepository;

    public ProshowService(ProshowRepository proshowRepository, ProshowRegistrationRepository proshowRegistrationRepository, UserRepository userRepository) {
        this.proshowRepository = proshowRepository;
        this.proshowRegistrationRepository = proshowRegistrationRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getAllProshows() {
        return Map.of("proshows", proshowRepository.findAll().stream()
                .sorted(Comparator.comparing(ProShow::getDateTime)).toList());
    }

    public ProShow getProshowById(UUID proshowId) {
        return proshowRepository.findById(proshowId).orElse(null);
    }

    public Map<String, String> createProshow(ProShow newProshow) {
        Map<String, String> map = new HashMap<>();
        try {
            proshowRepository.save(newProshow);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create proshow: " + e.getMessage());
        }
        map.put("message", "Proshow created successfully");
        return map;
    }

    public Map<String, String> updateProshow(UUID proshowId, ProShow newProshow) {
        Map<String, String> map = new HashMap<>();
        ProShow proshow = proshowRepository.findById(proshowId).orElse(null);
        if (proshow == null) {
            throw new RuntimeException("Proshow not found with id: " + proshowId);
        }
        try {
            if (newProshow.getTitle() != null) proshow.setTitle(newProshow.getTitle());
            if (newProshow.getDescription() != null) proshow.setDescription(newProshow.getDescription());
            if (newProshow.getArtist() != null) proshow.setArtist(newProshow.getArtist());
            if (newProshow.getDateTime() != null) proshow.setDateTime(newProshow.getDateTime());
            if (newProshow.getVenue() != null) proshow.setVenue(newProshow.getVenue());
            if (newProshow.getTicketPrice() >= 0) proshow.setTicketPrice(newProshow.getTicketPrice());
            proshowRepository.save(proshow);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update proshow: " + e.getMessage());
        }
        map.put("message", "Proshow updated successfully");
        return map;
    }

    public Map<String, String> deleteProshow(UUID proshowId) {
        Map<String, String> map = new HashMap<>();
        try {
            proshowRepository.deleteById(proshowId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete proshow: " + e.getMessage());
        }
        map.put("message", "Proshow deleted successfully");
        return map;
    }

    @Transactional
    public Map<String, String> registerForProshow(UUID proshowId, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ProShow proshow = proshowRepository.findById(proshowId).orElseThrow(() -> new RuntimeException("Proshow not found"));

        ProshowRegistration existing = proshowRegistrationRepository.findProshowRegistrationByUser_IdAndProshow_Id(userId, proshowId);
        if (existing != null) {
            throw new RuntimeException("User already registered for this proshow");
        }

        ProshowRegistration registration = new ProshowRegistration();
        registration.setProshow(proshow);
        registration.setUser(user);
        proshowRegistrationRepository.save(registration);

        return Map.of("message", "Registration for proshow successful");
    }

    public Map<String, Object> getMyProshowRegistrations(UUID userId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<ProshowRegistration> registrationList = proshowRegistrationRepository.findAllByUser_Id(userId);
        List<ProshowRegistrationDTO> dtoList = new ArrayList<>();
        for (ProshowRegistration reg : registrationList) {
            ProShow p = reg.getProshow();
            ProshowRegistrationDTO dto = new ProshowRegistrationDTO();
            dto.setProshowId(p.getId());
            dto.setProshowTitle(p.getTitle());
            dto.setArtist(p.getArtist());
            dto.setVenue(p.getVenue());
            dto.setDateTime(p.getDateTime());
            dto.setRegisteredAt(reg.getRegisteredAt());
            dtoList.add(dto);
        }
        return Map.of("registrations", dtoList);
    }
}
