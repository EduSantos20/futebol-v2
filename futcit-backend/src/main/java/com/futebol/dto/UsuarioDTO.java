package com.futebol.dto;

import com.futebol.enums.TipoUsuario;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UsuarioDTO {
    public String id, nome, email, fotoPerfil, telefone, cidade, posicao;
    public TipoUsuario tipoUsuario;
    public LocalDateTime criadoEm;
}
