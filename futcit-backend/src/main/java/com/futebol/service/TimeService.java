package com.futebol.service;

import com.futebol.dto.MembroDTO;
import com.futebol.dto.TimeDTO;
import com.futebol.entity.MembroTime;
import com.futebol.entity.Time;
import com.futebol.entity.Usuario;
import com.futebol.enums.StatusDesafio;
import com.futebol.repository.MembroTimeRepository;
import com.futebol.repository.TimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeService {

    private final TimeRepository repo;
    private final MembroTimeRepository membroRepo;

    private static final int LIMITE_TIMES = 2;

    public List<TimeDTO.Response> listarTodos() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public List<TimeDTO.Response> listarDisponiveis() {
        return repo.findByStatusDesafio(StatusDesafio.DISPONIVEL).stream().map(this::toResponse).toList();
    }

    public TimeDTO.Response buscarPorId(String id) {
        return toResponse(buscar(id));
    }

    public List<TimeDTO.Response> meusTimes(Usuario u) {
        return repo.findByUsuarioId(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public TimeDTO.Response criar(TimeDTO.Request req, Usuario u) {
        long total = repo.countByUsuarioId(u.getId());
        if (total >= LIMITE_TIMES)
            throw new RuntimeException("Limite de " + LIMITE_TIMES + " times por usuário atingido.");

        Time t = Time.builder()
                .nome(req.getNome()).bairro(req.getBairro()).cidade(req.getCidade())
                .numerJogadores(req.getNumerJogadores())
                .horariosDisponiveis(req.getHorariosDisponiveis())
                .statusDesafio(StatusDesafio.INDISPONIVEL)
                .usuario(u).build();
        return toResponse(repo.save(t));
    }

    @Transactional
    public TimeDTO.Response atualizar(String id, TimeDTO.Request req, Usuario u) {
        Time t = buscarDoUsuario(id, u);
        t.setNome(req.getNome()); t.setBairro(req.getBairro()); t.setCidade(req.getCidade());
        t.setNumerJogadores(req.getNumerJogadores());
        t.setHorariosDisponiveis(req.getHorariosDisponiveis());
        return toResponse(repo.save(t));
    }

    // ── Salvar escudo (upload de imagem) ──────────────────────────────────────
    @Transactional
    public TimeDTO.Response uploadEscudo(String id, MultipartFile arquivo, Usuario usuario, String uploadPath) {
        Time time = repo.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RuntimeException("Time não encontrado ou sem permissão"));
        try {

            if (arquivo.isEmpty()) {
                throw new RuntimeException("Arquivo vazio");
            }

            // verifica se é imagem
            String tipo = arquivo.getContentType();

            if (tipo == null || !tipo.startsWith("image/")) {
                throw new RuntimeException("Arquivo enviado não é uma imagem");
            }

            // limita tamanho
            if (arquivo.getSize() > 3 * 1024 * 1024) {
                throw new RuntimeException("Imagem muito grande. Máximo 3MB");
            }

            String nomeArquivo = "logo_" + UUID.randomUUID() + ".png";

            Path destino = Paths.get(uploadPath, nomeArquivo);

            Files.createDirectories(destino.getParent());

            // converte e redimensiona imagem
            net.coobird.thumbnailator.Thumbnails
                    .of(arquivo.getInputStream())
                    .size(300, 300)
                    .outputFormat("png")
                    .toFile(destino.toFile());

            time.setEscudoUrl("/uploads/" + nomeArquivo);

            return toResponse(repo.save(time));

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar escudo: " + e.getMessage());
        }
    }

    @Transactional
    public TimeDTO.Response alternarDisponibilidade(String id, Usuario u) {
        Time t = buscarDoUsuario(id, u);
        t.setStatusDesafio(t.getStatusDesafio() == StatusDesafio.DISPONIVEL
                ? StatusDesafio.INDISPONIVEL : StatusDesafio.DISPONIVEL);
        return toResponse(repo.save(t));
    }

    @Transactional
    public void deletar(String id, Usuario u) {
        repo.delete(buscarDoUsuario(id, u));
    }

    @Transactional
    public void marcarDisponivel(Time t) {
        t.setStatusDesafio(StatusDesafio.DISPONIVEL);
        repo.save(t);
    }

    public Time buscar(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Time não encontrado"));
    }

    private Time buscarDoUsuario(String id, Usuario u) {
        return repo.findByIdAndUsuarioId(id, u.getId())
                .orElseThrow(() -> new RuntimeException("Time não encontrado ou sem permissão"));
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    public TimeDTO.Response toResponse(Time t) {
        TimeDTO.Response r = new TimeDTO.Response();
        r.setId(t.getId());
        r.setNome(t.getNome());
        r.setEscudoUrl(t.getEscudoUrl());
        r.setBairro(t.getBairro());
        r.setCidade(t.getCidade());
        r.setNumerJogadores(t.getNumerJogadores());
        r.setHorariosDisponiveis(t.getHorariosDisponiveis());
        r.setStatusDesafio(t.getStatusDesafio());
        r.setUsuarioId(t.getUsuario().getId());
        r.setUsuarioNome(t.getUsuario().getNome());
        r.setCriadoEm(t.getCriadoEm());

        // Membros aprovados do time
        r.setMembros(membroRepo.findByTimeId(t.getId()).stream().map(m -> {
            MembroDTO.Response mr = new MembroDTO.Response();
            mr.setId(m.getId());
            mr.setUsuarioId(m.getUsuario().getId());
            mr.setUsuarioNome(m.getUsuario().getNome());
            mr.setUsuarioFoto(m.getUsuario().getFotoPerfil());
            mr.setPosicao(m.getPosicao() != null ? m.getPosicao() : m.getUsuario().getPosicao());
            mr.setCriadoEm(m.getCriadoEm());
            return mr;
        }).toList());

        return r;
    }
    @Transactional
public void removerMembro(String timeId, String membroId, Usuario usuario) {
    // Verifica se o usuário é dono do time
    Time time = buscarDoUsuario(timeId, usuario);

    // Busca o membro
    MembroTime membro = membroRepo.findById(membroId)
        .orElseThrow(() -> new RuntimeException("Membro não encontrado"));

    // Verifica se o membro pertence a este time
    if (!membro.getTime().getId().equals(timeId)) {
        throw new RuntimeException("Membro não pertence a este time");
    }

    // Remove o membro
    membroRepo.delete(membro);
}
}
