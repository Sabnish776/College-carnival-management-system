package com.app.ccms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue
    @Column(unique = true, nullable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id ;

    @Size(min = 1, max = 50)
    @NotNull
    @Column(nullable = false)
    private String name ;

    @Email
    @NotNull
    @Column(nullable = false, unique = true)
    private String email ;

    @NotNull
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 8, max = 100)
    private String password ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role ;

    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt ;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now() ;
    }

}
