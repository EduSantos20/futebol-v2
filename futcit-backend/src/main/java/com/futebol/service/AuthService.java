package com.futebol.service;

import com.futebol.dto.*;
import com.futebol.entity.PasswordResetToken;
import com.futebol.entity.Usuario;
import com.futebol.enums.TipoUsuario;
import com.futebol.repository.PasswordResetTokenRepository;
import com.futebol.repository.UsuarioRepository;
import com.futebol.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    // novos campos
    private final PasswordResetTokenRepository tokenRepo;
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.reset-token.expiration-minutes:60}")
    private long resetTokenExpirationMinutes;

    @Transactional
    public AuthResponseDTO registrar(AuthDTO.Registro req) {
        if (repo.findByEmail(req.getEmail()).isPresent())
            throw new RuntimeException("E-mail já cadastrado.");

        if (req.getTipoUsuario() == TipoUsuario.JOGADOR
                && (req.getPosicao() == null || req.getPosicao().isBlank()))
            throw new RuntimeException("Jogadores devem informar a posição.");

        Usuario usuario = Usuario.builder()
                .nome(req.getNome()).email(req.getEmail())
                .senha(encoder.encode(req.getSenha()))
                .tipoUsuario(req.getTipoUsuario())
                .posicao(req.getTipoUsuario() == TipoUsuario.JOGADOR ? req.getPosicao() : null)
                .telefone(req.getTelefone()).cidade(req.getCidade())
                .fotoPerfil(req.getFotoPerfil())
                .build();
        repo.save(usuario);
        return new AuthResponseDTO(jwt.gerar(usuario.getId()), toDTO(usuario));
    }

    public AuthResponseDTO login(AuthDTO.Login req) {
        Usuario u = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos."));
        if (!encoder.matches(req.getSenha(), u.getSenha()))
            throw new RuntimeException("E-mail ou senha incorretos.");
        return new AuthResponseDTO(jwt.gerar(u.getId()), toDTO(u));
    }

    public UsuarioDTO toDTO(Usuario u) {
        UsuarioDTO d = new UsuarioDTO();
        d.setId(u.getId()); d.setNome(u.getNome());
        d.setEmail(u.getEmail()); d.setFotoPerfil(u.getFotoPerfil());
        d.setTelefone(u.getTelefone()); d.setCidade(u.getCidade());
        d.setTipoUsuario(u.getTipoUsuario()); d.setPosicao(u.getPosicao());
        d.setCriadoEm(u.getCriadoEm());
        return d;
    }

    // ── Forgot password ────────────────────────────────────────────────────
    @Transactional
    public void forgotPassword(String email) {
        repo.findByEmail(email).ifPresent(u -> {
            // remover tokens antigos do usuário
            tokenRepo.deleteByUsuarioId(u.getId());

            String token = UUID.randomUUID().toString();
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(resetTokenExpirationMinutes);

            PasswordResetToken prt = PasswordResetToken.builder()
                    .token(token)
                    .usuario(u)
                    .expiryAt(expiry)
                    .build();

            tokenRepo.save(prt);

            // monta link (frontend)
            String link = frontendUrl + "/reset-senha?token=" + token;

            emailService.sendResetPasswordEmail(u.getEmail(), link);
        });
        // se email não existir, não faz nada (retorno genérico)
    }

    @Transactional
    public void resetPassword(String token, String novaSenha) {
        PasswordResetToken prt = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (prt.getExpiryAt() == null || prt.getExpiryAt().isBefore(LocalDateTime.now())) {
            // opcional: remover token expirado
            tokenRepo.delete(prt);
            throw new RuntimeException("Token expirado");
        }

        Usuario usuario = prt.getUsuario();
        usuario.setSenha(encoder.encode(novaSenha));
        repo.save(usuario);

        // invalidar token
        tokenRepo.delete(prt);
    }
}