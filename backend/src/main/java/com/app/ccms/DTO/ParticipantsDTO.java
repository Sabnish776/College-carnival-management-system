package com.app.ccms.DTO;

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
public class ParticipantsDTO {
    private UUID userId ;
    private String name ;
    private String email ;
    private LocalDateTime registeredAt ;

}
