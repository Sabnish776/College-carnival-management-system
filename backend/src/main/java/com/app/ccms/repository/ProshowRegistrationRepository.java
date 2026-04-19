package com.app.ccms.repository;

import com.app.ccms.model.ProshowRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProshowRegistrationRepository extends JpaRepository<ProshowRegistration, UUID> {
    ProshowRegistration findProshowRegistrationByUser_IdAndProshow_Id(UUID user_id, UUID proshow_id);
    List<ProshowRegistration> findAllByUser_Id(UUID userId);
    List<ProshowRegistration> findAllByProshow_Id(UUID proshowId);
    long countByProshow_Id(UUID proshowId);
}
