package com.futebol.controller;

import com.futebol.dto.TimeDTO;
import com.futebol.entity.Usuario;
import com.futebol.service.TimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/times")
@RequiredArgsConstructor
public class TimeController {
    private final TimeService service;
    @Value("${app.upload.path}")
    private String uploadPath;

    @GetMapping("/publicos")
    public ResponseEntity<List<TimeDTO.Response>> publicos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<TimeDTO.Response>> disponiveis() {
        return ResponseEntity.ok(service.listarDisponiveis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeDTO.Response> buscar(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/meus")
    public ResponseEntity<List<TimeDTO.Response>> meus(@AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.meusTimes(u));
    }

    @PostMapping("/registrar")
    public ResponseEntity<TimeDTO.Response> criar(@Valid @RequestBody TimeDTO.Request req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.criar(req, u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeDTO.Response> atualizar(@PathVariable String id, @Valid @RequestBody TimeDTO.Request req, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.atualizar(id, req, u));
    }

    @PostMapping("/{id}/escudo")
    public ResponseEntity<TimeDTO.Response> escudo(@PathVariable String id, @RequestParam("arquivo") MultipartFile arquivo, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.uploadEscudo(id, arquivo, u, uploadPath));
    }

    @PatchMapping("/{id}/disponibilidade")
    public ResponseEntity<TimeDTO.Response> disponib(@PathVariable String id, @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.alternarDisponibilidade(id, u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id, @AuthenticationPrincipal Usuario u) {
        service.deletar(id, u);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{id}/membros/{membroId}")
public ResponseEntity<Void> removerMembro(@PathVariable String id,
                                           @PathVariable String membroId,
                                           @AuthenticationPrincipal Usuario u) {
    service.removerMembro(id, membroId, u);
    return ResponseEntity.noContent().build();
}
}
