package com.futebol.entity;

import com.futebol.enums.StatusSolicitacao;
import com.futebol.enums.TipoSolicitacao;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes_time")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SolicitacaoTime {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_id", nullable = false)
    private Time time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSolicitacao tipo;  // ENTRADA | SAIDA

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    private String mensagem;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private LocalDateTime respondidoEm;

    @PrePersist
    public void prePersist() { this.criadoEm = LocalDateTime.now(); }
}
