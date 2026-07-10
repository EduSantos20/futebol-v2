package com.futebol.dto;

import com.futebol.enums.TipoUsuario;
import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class Registro {
        @NotBlank(message = "Nome é obrigatório")
        public String nome;

        @NotBlank @Email(message = "E-mail inválido")
        public String email;

        @NotBlank @Size(min = 6, message = "Senha mínimo 6 caracteres")
        public String senha;

        @NotNull(message = "Informe se é Jogador ou Dono de time")
        public TipoUsuario tipoUsuario;

        // Obrigatório se tipoUsuario = JOGADOR
        public String posicao;

        public String telefone;
        public String cidade;
        public String fotoPerfil;
    }

    @Data
    public static class Login {
        @NotBlank public String email;
        @NotBlank public String senha;
    }
}
