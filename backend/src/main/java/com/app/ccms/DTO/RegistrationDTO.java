package com.app.ccms.DTO;

import com.app.ccms.model.Category;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    private UUID eventId ;
    private String eventTitle ;
    private Category category;
    private LocalDateTime eventDateTime ;
    private String venue ;
    private LocalDateTime registeredAt ;
}
