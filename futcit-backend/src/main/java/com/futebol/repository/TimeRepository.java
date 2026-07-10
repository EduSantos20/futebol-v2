package com.futebol.repository;

import com.futebol.entity.Time;
import com.futebol.enums.StatusDesafio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TimeRepository extends JpaRepository<Time, String> {
    List<Time> findByUsuarioId(String usuarioId);
    long countByUsuarioId(String usuarioId);
    List<Time> findByStatusDesafio(StatusDesafio status);
    Optional<Time> findByIdAndUsuarioId(String id, String usuarioId);
}
