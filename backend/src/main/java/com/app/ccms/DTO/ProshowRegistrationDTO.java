package com.app.ccms.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProshowRegistrationDTO {
    private UUID proshowId;
    private String proshowTitle;
    private String artist;
    private String venue;
    private LocalDateTime dateTime;
    private LocalDateTime registeredAt;
}
