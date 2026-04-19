package com.app.ccms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "proshows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProShow {

    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotNull
    @Size(min = 3, max = 100)
    @Column(nullable = false)
    private String title;

    @NotNull
    @Size(min = 10, max = 500)
    @Column(nullable = false)
    private String description;

    @NotNull
    @Size(min = 2, max = 100)
    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @NotNull
    @Column(nullable = false)
    private String venue;

    @Min(0)
    @Column(nullable = false)
    private double ticketPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
