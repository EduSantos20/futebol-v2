package com.futebol.dto;

import com.futebol.enums.StatusSolicitacao;
import com.futebol.enums.TipoSolicitacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class SolicitacaoDTO {

    @Data
    public static class EntradaRequest {
        public String mensagem; // opcional
    }

    @Data
    public static class SaidaRequest {
        public String mensagem; // motivo da saída
    }

    @Data
    public static class ResponderRequest {
        @NotNull(message = "Informe se aprova ou recusa")
        public Boolean aprovar;
    }

    @Data
    public static class Response {
        public String id;
        public String timeId, timeNome;
        public String usuarioId, usuarioNome, usuarioFoto, usuarioPosicao;
        public TipoSolicitacao tipo;
        public StatusSolicitacao status;
        public String mensagem;
        public LocalDateTime criadoEm, respondidoEm;
    }
}
