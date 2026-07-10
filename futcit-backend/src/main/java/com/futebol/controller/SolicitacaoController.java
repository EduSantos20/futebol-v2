package com.futebol.controller;

import com.futebol.dto.MembroDTO;
import com.futebol.dto.SolicitacaoDTO;
import com.futebol.entity.Usuario;
import com.futebol.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService service;

    // ── Jogador solicita entrar no time ───────────────────────────────────────
    @PostMapping("/times/{timeId}/solicitar-entrada")
    public ResponseEntity<SolicitacaoDTO.Response> entrar(
            @PathVariable String timeId,
            @RequestBody(required = false) SolicitacaoDTO.EntradaRequest req,
            @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.solicitarEntrada(timeId, req, u));
    }

    // ── Jogador solicita sair do time ─────────────────────────────────────────
    @PostMapping("/times/{timeId}/solicitar-saida")
    public ResponseEntity<SolicitacaoDTO.Response> sair(
            @PathVariable String timeId,
            @RequestBody(required = false) SolicitacaoDTO.SaidaRequest req,
            @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.solicitarSaida(timeId, req, u));
    }

    // ── Dono aprova ou recusa solicitação ─────────────────────────────────────
    @PatchMapping("/solicitacoes/{id}/responder")
    public ResponseEntity<SolicitacaoDTO.Response> responder(
            @PathVariable String id,
            @Valid @RequestBody SolicitacaoDTO.ResponderRequest req,
            @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.responder(id, req, u));
    }

    // ── Dono vê pendentes do seu time ─────────────────────────────────────────
    @GetMapping("/times/{timeId}/solicitacoes")
    public ResponseEntity<List<SolicitacaoDTO.Response>> pendentes(
            @PathVariable String timeId,
            @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.pendentesDoTime(timeId, u));
    }

    // ── Jogador vê suas próprias solicitações ─────────────────────────────────
    @GetMapping("/solicitacoes/minhas")
    public ResponseEntity<List<SolicitacaoDTO.Response>> minhas(
            @AuthenticationPrincipal Usuario u) {
        return ResponseEntity.ok(service.minhasSolicitacoes(u));
    }

    // ── Listar membros de um time (público) ───────────────────────────────────
    @GetMapping("/times/{timeId}/membros")
    public ResponseEntity<List<MembroDTO>> membros(@PathVariable String timeId) {
        return ResponseEntity.ok(service.membrosDoTime(timeId));
    }
}
