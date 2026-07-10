package com.futebol.controller;

import com.futebol.dto.JogoDTO;
import com.futebol.entity.Usuario;
import com.futebol.service.JogoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/jogos")
@RequiredArgsConstructor
public class JogoController {

    private final JogoService service;

    // ── Dono desafia outro time ───────────────────────────────────────────────
    @PostMapping("/desafiar")
    public ResponseEntity<JogoDTO.Response> desafiar(@Valid @RequestBody JogoDTO.DesafiarRequest req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.desafiar(req, u));
    }

    // ── Dono responde a um desafio ────────────────────────────────────────────
    @PatchMapping("/{jogoId}/responder")
    public ResponseEntity<JogoDTO.Response> responder(@PathVariable String jogoId, @Valid @RequestBody JogoDTO.ResponderRequest req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.responder(jogoId, req, u));
    }

    // ── Dono cancela um jogo confirmado ───────────────────────────────────────
    @PatchMapping("/{jogoId}/cancelar")
    public ResponseEntity<JogoDTO.Response> cancelar(@PathVariable String jogoId, @Valid @RequestBody JogoDTO.CancelarRequest req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.cancelar(jogoId, req, u));
    }

    // ── Dono vê seus jogos ────────────────────────────────────────────────────
    @GetMapping("/meus")
    public ResponseEntity<List<JogoDTO.Response>> meusJogos(@AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.meusJogos(u));
    }

    // ── Dono vê desafios pendentes para responder ──────────────────────────────
    @GetMapping("/pendentes")
    public ResponseEntity<List<JogoDTO.Response>> pendentes(@AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.pendentesParaResponder(u));
    }

    // ── Registrar placar de um jogo confirmado ────────────────────────────────
    @PatchMapping("/{jogoId}/registrar-placar")
    public ResponseEntity<JogoDTO.Response> registrarPlacar(@PathVariable String jogoId, @Valid @RequestBody JogoDTO.RegistrarPlacarRequest req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.registrarPlacar(jogoId, req, u));
    }

    // ── Lista pública de confrontos (sem login) ───────────────────────────────
    @GetMapping("/confrontos")
    public ResponseEntity<List<JogoDTO.Response>> publicos(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate data
    ) {
        return ResponseEntity.ok(service.publicos(data));
    }
}