package com.app.ccms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table( name = "proshow_registrations" ,
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "proshow_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProshowRegistration {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="proshow_id" , nullable = false)
    private ProShow proshow;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onRegister(){
        this.registeredAt = LocalDateTime.now();
    }
}
