package com.futebol.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class AuthResponseDTO {
    public String token;
    public UsuarioDTO usuario;
}
