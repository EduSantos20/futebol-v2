package com.futebol.controller;

import com.futebol.dto.*;
import com.futebol.entity.Usuario;
import com.futebol.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.futebol.dto.ForgotPasswordDTO;
import com.futebol.dto.ResetPasswordDTO;


@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody AuthDTO.Registro req) {
        return ResponseEntity.ok(service.registrar(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthDTO.Login req) {
        return ResponseEntity.ok(service.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(@AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.toDTO(u));
    }

// dentro da classe AuthController (já existente)
@PostMapping("/forgot-password")
public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordDTO req) {
    service.forgotPassword(req.getEmail());
    // Sempre retornar 200 OK para não vazar a existência do e-mail
    return ResponseEntity.ok().build();
}

@PostMapping("/reset-password")
public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordDTO req) {
    service.resetPassword(req.getToken(), req.getSenha());
    return ResponseEntity.noContent().build();
}
}
