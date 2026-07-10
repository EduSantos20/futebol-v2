package com.futebol.entity;

import com.futebol.enums.StatusDesafio;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "times")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Time {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nome;

    private String escudoUrl;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    private String cidade;

    private int numerJogadores;
    private String horariosDisponiveis;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusDesafio statusDesafio = StatusDesafio.INDISPONIVEL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
