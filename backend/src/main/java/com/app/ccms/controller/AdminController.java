package com.app.ccms.controller;

import com.app.ccms.DTO.DashboardStatsDTO;
import com.app.ccms.repository.ProshowRegistrationRepository;
import com.app.ccms.repository.RegistrationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RegistrationRepository registrationRepository;
    private final ProshowRegistrationRepository proshowRegistrationRepository;

    public AdminController(RegistrationRepository registrationRepository, 
                           ProshowRegistrationRepository proshowRegistrationRepository) {
        this.registrationRepository = registrationRepository;
        this.proshowRegistrationRepository = proshowRegistrationRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        long totalRegistrations = registrationRepository.count();
        long ticketsSold = proshowRegistrationRepository.count();
        return ResponseEntity.ok(new DashboardStatsDTO(totalRegistrations, ticketsSold));
    }
}
