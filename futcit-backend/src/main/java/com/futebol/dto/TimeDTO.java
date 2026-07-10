package com.futebol.dto;

import com.futebol.enums.StatusDesafio;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class TimeDTO {
    @Data public static class Request {
        @NotBlank(message = "Nome é obrigatório")   public String nome;
        @NotBlank(message = "Bairro é obrigatório") public String bairro;
        @NotBlank(message = "Cidade é obrigatória") public String cidade;
        public int numerJogadores;
        public String horariosDisponiveis;
    }
    @Data public static class Response {
        public String id, nome, escudoUrl, bairro, cidade, horariosDisponiveis;
        public int numerJogadores;
        public StatusDesafio statusDesafio;
        public String usuarioId, usuarioNome;
        public LocalDateTime criadoEm;
        public List<MembroDTO.Response> membros;
    }
}
