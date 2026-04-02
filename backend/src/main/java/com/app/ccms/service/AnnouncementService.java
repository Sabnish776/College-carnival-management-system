package com.app.ccms.service;

import com.app.ccms.model.Announcement;
import com.app.ccms.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public Map<String, String> makeAnnouncement(Announcement newAnnouncement) {
        try{
            announcementRepository.save(newAnnouncement);
        }catch (Exception e){
            throw new RuntimeException("Error saving announcement: " + e.getMessage());
        }
        return Map.of("message", "Announcement made successfully");
    }

    public Map<String, Object> getAnnouncements() {
        return Map.of("announcements", announcementRepository.findAll()  ) ;
    }

    public Map<String, String> deleteAnnouncement(UUID announcementId) {
        try{
            if(announcementRepository.getAnnouncementById(announcementId) == null ){
                throw new RuntimeException("Announcement not found with id: " + announcementId);
            }
            announcementRepository.deleteById(announcementId);
        }catch (Exception e){
            throw new RuntimeException("Error deleting announcement: " + e.getMessage());
        }
        return Map.of("message", "Announcement deleted successfully");
    }
}
