package com.app.ccms.controller;

import com.app.ccms.model.Announcement;
import com.app.ccms.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/")
public class AnnouncementController {

    private final AnnouncementService  announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping("/admin/announcements")
    public ResponseEntity<Map<String,String>> makeAnnouncement(@RequestBody Announcement newAnnouncement) {
        Map<String,String> response ;
        try{
            response = announcementService.makeAnnouncement(newAnnouncement) ;
            return ResponseEntity.ok(response);
        }catch (Exception e){
            response = new HashMap<>();
            response.put("message",e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/announcements")
    public ResponseEntity<Map<String,Object>> getAllAnnouncements() {
        Map<String,Object> response ;
        try{
            response = announcementService.getAnnouncements() ;
            return ResponseEntity.ok(response);
        }catch (Exception e){
            response = new HashMap<>();
            response.put("message",e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/admin/announcements/{announcementId}")
    public ResponseEntity<Map<String,String>> deleteAnnouncement(@PathVariable UUID announcementId) {
        Map<String,String> response ;
        try{
            response = announcementService.deleteAnnouncement(announcementId) ;
            return ResponseEntity.ok(response);
        }catch (Exception e){
            response = new HashMap<>();
            response.put("message",e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
