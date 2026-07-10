package com.futebol.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MembroDTO {

    // Usado diretamente nos endpoints de membros
    public String id;
    public String usuarioId, usuarioNome, usuarioFoto, posicao;
    public LocalDateTime criadoEm;

    // Alias para compatibilidade com TimeDTO.Response
    @Data
    public static class Response {
        public String id;
        public String usuarioId, usuarioNome, usuarioFoto, posicao;
        public LocalDateTime criadoEm;
    }
}
