package com.futebol.entity;

import com.futebol.enums.StatusJogo;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "jogos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_desafiante_id", nullable = false)
    private Time timeDesafiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_desafiado_id", nullable = false)
    private Time timeDesafiado;

    @Column(nullable = false)
    private LocalDate dataJogo;

    private LocalTime horarioJogo;
    private boolean temCampo;
    private String nomeCampo;
    private String localCampo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusJogo status = StatusJogo.PENDENTE;

    private String motivoRecusa;

    @Column(columnDefinition = "TEXT")
    private String observacaoCancelamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelado_por_id")
    private Usuario canceladoPor;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private LocalDateTime canceladoEm;

    private Integer golsDesafiante;
    private Integer golsDesafiado;
    private LocalDateTime finalizadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
