package com.app.ccms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {
    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotNull
    @Column(nullable = false,updatable = false)
    private String title;

    @NotNull
    @Column(nullable = false,updatable = false)
    private String description;

    @Column(nullable = false,updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt ;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now() ;
    }

}
