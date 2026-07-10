package com.futebol.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordDTO {
    @NotBlank
    private String token;

    @NotBlank @Size(min = 6, message = "Senha mínimo 6 caracteres")
    private String senha;
}