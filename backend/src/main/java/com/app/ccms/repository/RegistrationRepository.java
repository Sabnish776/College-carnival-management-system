package com.app.ccms.repository;

import com.app.ccms.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
    Registration findRegistrationByUser_IdAndEvent_Id(UUID user_id, UUID event_id);

    List<Registration> findAllByUser_Id(UUID userId);

    List<Registration> findAllByEvent_Id(UUID eventId);

    long countByEvent_Id(UUID eventId);
}
