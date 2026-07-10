package com.futebol.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "membros_time",
       uniqueConstraints = @UniqueConstraint(columnNames = {"time_id","usuario_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MembroTime {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_id", nullable = false)
    private Time time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // posição do jogador neste time (pode mudar por time)
    private String posicao;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() { this.criadoEm = LocalDateTime.now(); }
}
