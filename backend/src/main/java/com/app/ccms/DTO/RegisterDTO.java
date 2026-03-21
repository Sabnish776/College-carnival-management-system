package com.app.ccms.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    @NotNull
    private String name ;

    @NotNull
    @Email
    private String email ;

    @NotNull
    @Size(min = 3, max = 100)
    private String password ;
}
