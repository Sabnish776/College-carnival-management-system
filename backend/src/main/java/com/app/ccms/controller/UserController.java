package com.app.ccms.controller;

import com.app.ccms.model.User;
import com.app.ccms.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService ;

    public UserController(UserService userService){
        this.userService = userService ;
    }

    @GetMapping("/users/me")
    public ResponseEntity<Map<String,Object>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = null ;
        Map<String , Object > response = new HashMap<>() ;
        try{
            user = userService.getUserByEmail(userDetails.getUsername());
        }catch (Exception e){
            response.put("message",e.getMessage()) ;
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND) ;
        }
        response.put("user",user) ;
        return ResponseEntity.ok(response) ;

    }
}
