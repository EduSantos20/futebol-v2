package com.futebol.service;

import com.futebol.config.BusinessException;
import com.futebol.dto.JogoDTO;
import com.futebol.entity.*;
import com.futebol.enums.*;
import com.futebol.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JogoService {

    private final JogoRepository jogoRepo;
    private final TimeRepository timeRepo;
    private final TimeService timeService;

    @Transactional
    public JogoDTO.Response desafiar(JogoDTO.DesafiarRequest req, Usuario u) {

        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        if (u.getTipoUsuario() != TipoUsuario.DONO)
            throw new BusinessException("Apenas donos de time podem enviar desafios.");

        Time desafiante = timeRepo.findByIdAndUsuarioId(req.getTimeDesafianteId(), u.getId())
                .orElseThrow(() -> new BusinessException("Time desafiante não encontrado ou sem permissão"));

        Time desafiado = timeRepo.findById(req.getTimeDesafiadoId())
                .orElseThrow(() -> new BusinessException("Time adversário não encontrado"));

        if (desafiante.getId().equals(desafiado.getId()))
            throw new BusinessException("Não pode desafiar o mesmo time");

        if (desafiado.getUsuario().getId().equals(u.getId()))
            throw new BusinessException("Não pode desafiar seus próprios times");

        if (jogoRepo.existePendente(desafiante.getId(), desafiado.getId()))
            throw new BusinessException("Já existe um desafio pendente para este adversário");

        Jogo j = Jogo.builder()
                .timeDesafiante(desafiante)
                .timeDesafiado(desafiado)
                .dataJogo(req.getDataJogo())
                .horarioJogo(req.getHorarioJogo())
                .temCampo(req.isTemCampo())
                .nomeCampo(req.isTemCampo() ? req.getNomeCampo() : null)
                .localCampo(req.isTemCampo() ? req.getLocalCampo() : null)
                .status(StatusJogo.PENDENTE)
                .build();

        Jogo salvo = jogoRepo.save(j);

        return toResponse(
                jogoRepo.findByIdWithRelations(salvo.getId()).orElse(salvo)
        );
    }

    @Transactional
    public JogoDTO.Response responder(String jogoId, JogoDTO.ResponderRequest req, Usuario u) {

        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        Jogo j = jogoRepo.findByIdWithRelations(jogoId)
                .orElseThrow(() -> new BusinessException("Jogo não encontrado"));

        if (j.getStatus() != StatusJogo.PENDENTE)
            throw new BusinessException("Este desafio não está mais pendente");

        if (!j.getTimeDesafiado().getUsuario().getId().equals(u.getId()))
            throw new BusinessException("Apenas o time desafiado pode responder");

        if (req.getAceitar()) {
            j.setStatus(StatusJogo.CONFIRMADO);
        } else {
            j.setStatus(StatusJogo.RECUSADO);
            j.setMotivoRecusa(req.getMotivoRecusa());
            timeService.marcarDisponivel(j.getTimeDesafiado());
        }

        Jogo salvo = jogoRepo.save(j);

        return toResponse(
                jogoRepo.findByIdWithRelations(salvo.getId()).orElse(salvo)
        );
    }

    @Transactional
    public JogoDTO.Response cancelar(String jogoId, JogoDTO.CancelarRequest req, Usuario u) {

        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        Jogo j = jogoRepo.findByIdWithRelations(jogoId)
                .orElseThrow(() -> new BusinessException("Jogo não encontrado"));

        if (j.getStatus() != StatusJogo.CONFIRMADO)
            throw new BusinessException("Apenas jogos confirmados podem ser cancelados");

        boolean ehDesafiante = j.getTimeDesafiante().getUsuario().getId().equals(u.getId());
        boolean ehDesafiado  = j.getTimeDesafiado().getUsuario().getId().equals(u.getId());

        if (!ehDesafiante && !ehDesafiado)
            throw new BusinessException("Sem permissão para cancelar este jogo");

        j.setStatus(StatusJogo.CANCELADO);
        j.setObservacaoCancelamento(req.getObservacao());
        j.setCanceladoPor(u);
        j.setCanceladoEm(LocalDateTime.now());

        timeService.marcarDisponivel(
                ehDesafiante ? j.getTimeDesafiado() : j.getTimeDesafiante()
        );

        Jogo salvo = jogoRepo.save(j);

        return toResponse(
                jogoRepo.findByIdWithRelations(salvo.getId()).orElse(salvo)
        );
    }

    public List<JogoDTO.Response> meusJogos(Usuario u) {
        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        return jogoRepo.findByUsuario(u.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<JogoDTO.Response> pendentesParaResponder(Usuario u) {
        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        return jogoRepo.findPendentesParaResponder(u.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JogoDTO.Response registrarPlacar(String jogoId, JogoDTO.RegistrarPlacarRequest req, Usuario u) {
        if (u == null)
            throw new BusinessException("Usuário não autenticado");

        Jogo j = jogoRepo.findByIdWithRelations(jogoId)
                .orElseThrow(() -> new BusinessException("Jogo não encontrado"));

        if (j.getStatus() != StatusJogo.CONFIRMADO)
            throw new BusinessException("Apenas jogos confirmados podem ter placar registrado");

        boolean ehDesafiante = j.getTimeDesafiante().getUsuario().getId().equals(u.getId());
        boolean ehDesafiado = j.getTimeDesafiado().getUsuario().getId().equals(u.getId());

        if (!ehDesafiante && !ehDesafiado)
            throw new BusinessException("Apenas os times envolvidos podem registrar o placar");

        j.setGolsDesafiante(req.getGolsDesafiante());
        j.setGolsDesafiado(req.getGolsDesafiado());
        j.setStatus(StatusJogo.FINALIZADO);
        j.setFinalizadoEm(LocalDateTime.now());

        Jogo salvo = jogoRepo.save(j);

        return toResponse(
                jogoRepo.findByIdWithRelations(salvo.getId()).orElse(salvo)
        );
    }

    public List<JogoDTO.Response> publicos(LocalDate data) {

        List<Jogo> jogos = (data == null)
                ? jogoRepo.findPublicos()
                : jogoRepo.findPublicosPorData(data);

        return jogos.stream()
                .map(this::toResponse)
                .toList();
    }

    private JogoDTO.Response toResponse(Jogo j) {
        JogoDTO.Response r = new JogoDTO.Response();

        r.setId(j.getId());
        r.setTimeDesafiante(timeService.toResponse(j.getTimeDesafiante()));
        r.setTimeDesafiado(timeService.toResponse(j.getTimeDesafiado()));
        r.setDataJogo(j.getDataJogo());
        r.setHorarioJogo(j.getHorarioJogo());
        r.setTemCampo(j.isTemCampo());
        r.setNomeCampo(j.getNomeCampo());
        r.setLocalCampo(j.getLocalCampo());
        r.setStatus(j.getStatus());
        r.setMotivoRecusa(j.getMotivoRecusa());
        r.setObservacaoCancelamento(j.getObservacaoCancelamento());
        r.setCanceladoPorNome(
                j.getCanceladoPor() != null ? j.getCanceladoPor().getNome() : null
        );
        r.setCriadoEm(j.getCriadoEm());
        r.setCanceladoEm(j.getCanceladoEm());
        r.setGolsDesafiante(j.getGolsDesafiante());
        r.setGolsDesafiado(j.getGolsDesafiado());
        r.setFinalizadoEm(j.getFinalizadoEm());

        return r;
    }
}