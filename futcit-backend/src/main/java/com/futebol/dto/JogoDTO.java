package com.futebol.dto;

import com.futebol.enums.StatusJogo;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.*;

public class JogoDTO {
    @Data public static class DesafiarRequest {
        @NotBlank public String timeDesafianteId;
        @NotBlank public String timeDesafiadoId;
        @NotNull(message = "Data do jogo é obrigatória") public LocalDate dataJogo;
        public LocalTime horarioJogo;
        public boolean temCampo;
        public String nomeCampo, localCampo;
    }
    @Data public static class ResponderRequest {
        @NotNull public Boolean aceitar;
        public String motivoRecusa;
    }
    @Data public static class CancelarRequest {
        @NotBlank(message = "Informe o motivo do cancelamento") public String observacao;
    }
    @Data public static class RegistrarPlacarRequest {
        @Min(0) @NotNull public Integer golsDesafiante;
        @Min(0) @NotNull public Integer golsDesafiado;
    }
    @Data public static class Response {
        public String id;
        public TimeDTO.Response timeDesafiante, timeDesafiado;
        public LocalDate dataJogo;
        public LocalTime horarioJogo;
        public boolean temCampo;
        public String nomeCampo, localCampo;
        public StatusJogo status;
        public String motivoRecusa, observacaoCancelamento, canceladoPorNome;
        public LocalDateTime criadoEm, canceladoEm;
        public Integer golsDesafiante, golsDesafiado;
        public LocalDateTime finalizadoEm;
    }
}
