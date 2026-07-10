package com.futebol.repository;

import com.futebol.entity.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface JogoRepository extends JpaRepository<Jogo, String> {

    // Carrega tudo com JOIN FETCH para evitar LazyInitializationException
    @Query("""
        SELECT j FROM Jogo j
        JOIN FETCH j.timeDesafiante td JOIN FETCH td.usuario
        JOIN FETCH j.timeDesafiado tdo JOIN FETCH tdo.usuario
        LEFT JOIN FETCH j.canceladoPor
        WHERE td.usuario.id = :uid OR tdo.usuario.id = :uid
        ORDER BY j.criadoEm DESC
        """)
    List<Jogo> findByUsuario(@Param("uid") String usuarioId);

    @Query("""
        SELECT j FROM Jogo j
        JOIN FETCH j.timeDesafiante td JOIN FETCH td.usuario
        JOIN FETCH j.timeDesafiado tdo JOIN FETCH tdo.usuario
        WHERE tdo.usuario.id = :uid AND j.status = 'PENDENTE'
        ORDER BY j.criadoEm DESC
        """)
    List<Jogo> findPendentesParaResponder(@Param("uid") String usuarioId);

    @Query("""
        SELECT j FROM Jogo j
        JOIN FETCH j.timeDesafiante td JOIN FETCH td.usuario
        JOIN FETCH j.timeDesafiado tdo JOIN FETCH tdo.usuario
        LEFT JOIN FETCH j.canceladoPor
        WHERE j.id = :id
        """)
    Optional<Jogo> findByIdWithRelations(@Param("id") String id);

    @Query("SELECT COUNT(j) > 0 FROM Jogo j WHERE j.timeDesafiante.id = :aid AND j.timeDesafiado.id = :bid AND j.status = 'PENDENTE'")
    boolean existePendente(@Param("aid") String desafianteId, @Param("bid") String desafiadoId);


    @Query("""
    SELECT j FROM Jogo j
    JOIN FETCH j.timeDesafiante td JOIN FETCH td.usuario
    JOIN FETCH j.timeDesafiado tdo JOIN FETCH tdo.usuario
    WHERE j.status IN ('CONFIRMADO', 'FINALIZADO')
    ORDER BY j.dataJogo DESC, j.criadoEm DESC
""")
    List<Jogo> findPublicos();

    @Query("""
    SELECT j FROM Jogo j
    JOIN FETCH j.timeDesafiante td JOIN FETCH td.usuario
    JOIN FETCH j.timeDesafiado tdo JOIN FETCH tdo.usuario
    WHERE j.status IN ('CONFIRMADO', 'FINALIZADO')
      AND j.dataJogo = :data
    ORDER BY j.dataJogo DESC, j.criadoEm DESC
""")
    List<Jogo> findPublicosPorData(@Param("data") LocalDate data);
}
