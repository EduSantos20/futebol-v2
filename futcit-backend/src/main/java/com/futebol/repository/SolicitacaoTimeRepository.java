package com.futebol.repository;

import com.futebol.entity.SolicitacaoTime;
import com.futebol.enums.StatusSolicitacao;
import com.futebol.enums.TipoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoTimeRepository extends JpaRepository<SolicitacaoTime, String> {

    @Query("SELECT s FROM SolicitacaoTime s JOIN FETCH s.usuario JOIN FETCH s.time t JOIN FETCH t.usuario WHERE s.time.id = :timeId AND s.status = 'PENDENTE' ORDER BY s.criadoEm DESC")
    List<SolicitacaoTime> findPendentesByTime(@Param("timeId") String timeId);

    @Query("SELECT s FROM SolicitacaoTime s JOIN FETCH s.time WHERE s.usuario.id = :uid ORDER BY s.criadoEm DESC")
    List<SolicitacaoTime> findByUsuarioIdOrderByCriadoEmDesc(@Param("uid") String usuarioId);

    boolean existsByTimeIdAndUsuarioIdAndTipoAndStatus(
        String timeId, String usuarioId,
        TipoSolicitacao tipo, StatusSolicitacao status);

    // Query explícita com JOIN para garantir carregamento correto
    @Query("SELECT s FROM SolicitacaoTime s JOIN FETCH s.time t JOIN FETCH t.usuario JOIN FETCH s.usuario WHERE s.id = :id AND t.usuario.id = :donoId")
    Optional<SolicitacaoTime> findByIdAndTimeDonoId(@Param("id") String id, @Param("donoId") String donoId);
}
