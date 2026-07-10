package com.futebol.service;

import com.futebol.dto.MembroDTO;
import com.futebol.dto.SolicitacaoDTO;
import com.futebol.entity.*;
import com.futebol.enums.*;
import com.futebol.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private static final int LIMITE = 2;

    private final SolicitacaoTimeRepository solRepo;
    private final MembroTimeRepository membroRepo;
    private final TimeRepository timeRepo;

    // ── Jogador solicita entrar ───────────────────────────────────────────────
    @Transactional
    public SolicitacaoDTO.Response solicitarEntrada(String timeId, SolicitacaoDTO.EntradaRequest req, Usuario jogador) {
        checarJogador(jogador);
        Time time = getTime(timeId);

        if (membroRepo.existsByTimeIdAndUsuarioId(timeId, jogador.getId()))
            throw new RuntimeException("Você já é membro deste time.");

        if (membroRepo.countByUsuarioId(jogador.getId()) >= LIMITE)
            throw new RuntimeException("Você já faz parte de " + LIMITE + " times. Solicite saída de um antes de entrar em outro.");

        if (solRepo.existsByTimeIdAndUsuarioIdAndTipoAndStatus(
                timeId, jogador.getId(), TipoSolicitacao.ENTRADA, StatusSolicitacao.PENDENTE))
            throw new RuntimeException("Você já tem uma solicitação pendente para este time.");

        SolicitacaoTime s = SolicitacaoTime.builder()
                .time(time).usuario(jogador)
                .tipo(TipoSolicitacao.ENTRADA)
                .status(StatusSolicitacao.PENDENTE)
                .mensagem(req != null ? req.getMensagem() : null)
                .build();

        return toResp(solRepo.save(s));
    }

    // ── Jogador solicita sair ─────────────────────────────────────────────────
    @Transactional
    public SolicitacaoDTO.Response solicitarSaida(String timeId, SolicitacaoDTO.SaidaRequest req, Usuario jogador) {
        checarJogador(jogador);
        Time time = getTime(timeId);

        if (!membroRepo.existsByTimeIdAndUsuarioId(timeId, jogador.getId()))
            throw new RuntimeException("Você não é membro deste time.");

        if (solRepo.existsByTimeIdAndUsuarioIdAndTipoAndStatus(
                timeId, jogador.getId(), TipoSolicitacao.SAIDA, StatusSolicitacao.PENDENTE))
            throw new RuntimeException("Já existe uma solicitação de saída pendente.");

        SolicitacaoTime s = SolicitacaoTime.builder()
                .time(time).usuario(jogador)
                .tipo(TipoSolicitacao.SAIDA)
                .status(StatusSolicitacao.PENDENTE)
                .mensagem(req != null ? req.getMensagem() : null)
                .build();

        return toResp(solRepo.save(s));
    }

    // ── Dono responde ─────────────────────────────────────────────────────────
    @Transactional
    public SolicitacaoDTO.Response responder(String solId, SolicitacaoDTO.ResponderRequest req, Usuario dono) {
        // Usa query com JOIN explícito para evitar LazyInitializationException
        SolicitacaoTime s = solRepo.findByIdAndTimeDonoId(solId, dono.getId())
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada ou sem permissão."));

        if (s.getStatus() != StatusSolicitacao.PENDENTE)
            throw new RuntimeException("Esta solicitação já foi respondida.");

        s.setRespondidoEm(LocalDateTime.now());

        if (req.getAprovar()) {
            s.setStatus(StatusSolicitacao.APROVADO);

            if (s.getTipo() == TipoSolicitacao.ENTRADA) {
                long total = membroRepo.countByUsuarioId(s.getUsuario().getId());
                if (total >= LIMITE)
                    throw new RuntimeException("Jogador já atingiu o limite de " + LIMITE + " times.");

                if (!membroRepo.existsByTimeIdAndUsuarioId(s.getTime().getId(), s.getUsuario().getId())) {
                    MembroTime m = MembroTime.builder()
                            .time(s.getTime())
                            .usuario(s.getUsuario())
                            .posicao(s.getUsuario().getPosicao())
                            .build();
                    membroRepo.save(m);
                }
            } else {
                // SAIDA aprovada — remove o membro
                membroRepo.findByTimeIdAndUsuarioId(s.getTime().getId(), s.getUsuario().getId())
                        .ifPresent(membroRepo::delete);
            }
        } else {
            s.setStatus(StatusSolicitacao.RECUSADO);
        }

        return toResp(solRepo.save(s));
    }

    // ── Listar pendentes do time ──────────────────────────────────────────────
    public List<SolicitacaoDTO.Response> pendentesDoTime(String timeId, Usuario dono) {
        Time time = getTime(timeId);
        if (!time.getUsuario().getId().equals(dono.getId()))
            throw new RuntimeException("Sem permissão para ver solicitações deste time.");
        return solRepo.findPendentesByTime(timeId).stream().map(this::toResp).toList();
    }

    // ── Histórico do jogador ──────────────────────────────────────────────────
    public List<SolicitacaoDTO.Response> minhasSolicitacoes(Usuario jogador) {
        return solRepo.findByUsuarioIdOrderByCriadoEmDesc(jogador.getId())
                .stream().map(this::toResp).toList();
    }

    // ── Listar membros de um time ─────────────────────────────────────────────
    public List<MembroDTO> membrosDoTime(String timeId) {
        return membroRepo.listarMembros(timeId).stream().map(this::toMembro).toList();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private void checarJogador(Usuario u) {
        if (u.getTipoUsuario() != TipoUsuario.JOGADOR)
            throw new RuntimeException("Apenas jogadores podem solicitar entrada/saída de times.");
    }

    private Time getTime(String id) {
        return timeRepo.findById(id).orElseThrow(() -> new RuntimeException("Time não encontrado."));
    }

    private SolicitacaoDTO.Response toResp(SolicitacaoTime s) {
        SolicitacaoDTO.Response r = new SolicitacaoDTO.Response();
        r.setId(s.getId());
        r.setTimeId(s.getTime().getId());
        r.setTimeNome(s.getTime().getNome());
        r.setUsuarioId(s.getUsuario().getId());
        r.setUsuarioNome(s.getUsuario().getNome());
        r.setUsuarioFoto(s.getUsuario().getFotoPerfil());
        r.setUsuarioPosicao(s.getUsuario().getPosicao());
        r.setTipo(s.getTipo());
        r.setStatus(s.getStatus());
        r.setMensagem(s.getMensagem());
        r.setCriadoEm(s.getCriadoEm());
        r.setRespondidoEm(s.getRespondidoEm());
        return r;
    }

    private MembroDTO toMembro(MembroTime m) {
        MembroDTO d = new MembroDTO();
        d.setId(m.getId());
        d.setUsuarioId(m.getUsuario().getId());
        d.setUsuarioNome(m.getUsuario().getNome());
        d.setUsuarioFoto(m.getUsuario().getFotoPerfil());
        d.setPosicao(m.getPosicao() != null ? m.getPosicao() : m.getUsuario().getPosicao());
        d.setCriadoEm(m.getCriadoEm());
        return d;
    }
}
