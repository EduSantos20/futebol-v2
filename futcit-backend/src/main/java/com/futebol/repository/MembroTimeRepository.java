package com.futebol.repository;

import com.futebol.entity.MembroTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MembroTimeRepository extends JpaRepository<MembroTime, String> {

    List<MembroTime> findByTimeId(String timeId);

    List<MembroTime> findByUsuarioId(String usuarioId);

    long countByUsuarioId(String usuarioId);

    boolean existsByTimeIdAndUsuarioId(String timeId, String usuarioId);

    Optional<MembroTime> findByTimeIdAndUsuarioId(String timeId, String usuarioId);

    @Query("SELECT m FROM MembroTime m WHERE m.time.id = :timeId ORDER BY m.criadoEm ASC")
    List<MembroTime> listarMembros(@Param("timeId") String timeId);
}
