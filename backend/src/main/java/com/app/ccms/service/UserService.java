package com.app.ccms.service;
import com.app.ccms.DTO.RegisterDTO;
import com.app.ccms.model.Role;
import com.app.ccms.model.User;
import com.app.ccms.repository.UserRepository;
import com.app.ccms.utilities.JwtUtil;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    UserService(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil , UserRepository userRepository) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public void register(RegisterDTO registerDTO) {

        if (userRepository.findByEmail(registerDTO.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole(Role.STUDENT);
        System.out.println("Registering user: " + user.getEmail());
        userRepository.save(user);
    }
}
