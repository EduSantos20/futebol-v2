import { useEffect, useRef, useState } from "react";
import { timesApi, solicitacoesApi } from "../api";
import TimeCard, { AvatarJogador } from "../components/TimeCard";
import toast from "react-hot-toast";
import { capitalize } from "../utils/capitalize";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaCamera,
  FaCheck,
  FaTimes,
  FaBell,
} from "react-icons/fa";

const VAZIO = {
  nome: "",
  bairro: "",
  cidade: "",
  numerJogadores: "",
  horariosDisponiveis: "",
};
const LIMITE = 2;

export default function MeusTimes() {
  const fileRefs = useRef({});
  const [times, setTimes] = useState([]);
  const [membros, setMembros] = useState({}); // { [timeId]: MembroDTO[] }
  const [pendentes, setPendentes] = useState({}); // { [timeId]: SolicitacaoDTO[] }
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [confirmRemoverMembro, setConfirmRemoverMembro] = useState(null);

  // Carrega times + membros + pendentes de cada time
  const carregarTudo = async () => {
    try {
      const { data: ts } = await timesApi.meus();
      setTimes(ts);

      if (ts.length === 0) return;

      const resultados = await Promise.allSettled(
        ts.flatMap((t) => [
          solicitacoesApi
            .membros(t.id)
            .then((r) => ({ tipo: "membro", id: t.id, data: r.data })),
          solicitacoesApi
            .pendentes(t.id)
            .then((r) => ({ tipo: "pendente", id: t.id, data: r.data })),
        ]),
      );

      const novosM = {},
        novosP = {};
      resultados.forEach((r) => {
        if (r.status === "fulfilled") {
          const { tipo, id, data } = r.value;
          if (tipo === "membro") novosM[id] = data;
          if (tipo === "pendente") novosP[id] = data;
        }
      });
      setMembros(novosM);
      setPendentes(novosP);
    } catch (err) {
      toast.error("Erro ao carregar times");
    } finally {
      setLoading(false);
    }
  };

  const recarregarTime = async (timeId) => {
    try {
      const [mem, pend] = await Promise.all([
        solicitacoesApi.membros(timeId),
        solicitacoesApi.pendentes(timeId),
      ]);
      setMembros((p) => ({ ...p, [timeId]: mem.data }));
      setPendentes((p) => ({ ...p, [timeId]: pend.data }));
    } catch {
      /* silencioso */
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  const set = (k) => (e) => {
    const value = e.target.value;
    // Capitaliza campos de texto (primeira letra maiúscula, resto minúscula)
    const fieldsCapitalize = ["nome", "bairro", "cidade", "horariosDisponiveis"];
    const valorFinal = fieldsCapitalize.includes(k) ? capitalize(value) : value;
    setForm((f) => ({ ...f, [k]: valorFinal }));
  };

  const salvar = async () => {
    if (!form.nome || !form.bairro || !form.cidade) {
      toast.error("Nome, bairro e cidade são obrigatórios");
      return;
    }
    setSalvando(true);
    try {
      const p = { ...form, numerJogadores: Number(form.numerJogadores) || 0 };
      if (editId) {
        const { data } = await timesApi.atualizar(editId, p);
        setTimes((v) => v.map((t) => (t.id === editId ? data : t)));
        toast.success("Time atualizado!");
      } else {
        const { data } = await timesApi.criar(p);
        setTimes((v) => [...v, data]);
        setPendentes((p) => ({ ...p, [data.id]: [] }));
        setMembros((p) => ({ ...p, [data.id]: [] }));
        toast.success("Time cadastrado!");
      }
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  };

  const deletar = async (id) => {
    try {
      await timesApi.deletar(id);
      setTimes((v) => v.filter((t) => t.id !== id));
      toast.success("Time removido");
      setConfirmDel(null);
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const disponib = async (id) => {
    try {
      const { data } = await timesApi.disponib(id);
      setTimes((v) => v.map((t) => (t.id === id ? data : t)));
      toast.success(
        data.statusDesafio === "DISPONIVEL"
          ? "✅ Visível na lista!"
          : "Removido da lista",
      );
    } catch {
      toast.error("Erro");
    }
  };

  const onEscudo = async (timeId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("arquivo", file);
    try {
      const { data } = await timesApi.escudo(timeId, fd);
      setTimes((v) => v.map((t) => (t.id === timeId ? data : t)));
      toast.success("Escudo atualizado!");
    } catch {
      toast.error("Erro ao enviar escudo");
    }
  };

  const responderSolicitacao = async (solId, timeId, aprovar) => {
    try {
      await solicitacoesApi.responder(solId, { aprovar });
      toast.success(aprovar ? "✅ Jogador aprovado!" : "Solicitação recusada.");
      await recarregarTime(timeId);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao responder");
    }
  };

  const removerMembro = async () => {
    if (!confirmRemoverMembro) return;
    try {
      setSalvando(true);
      await solicitacoesApi.remover(confirmRemoverMembro.timeId, confirmRemoverMembro.usuarioId);
      toast.success("Jogador removido do time");
      await recarregarTime(confirmRemoverMembro.timeId);
      setConfirmRemoverMembro(null);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao remover jogador");
    } finally {
      setSalvando(false);
    }
  };

  const totalPendentes = Object.values(pendentes).flat().length;
  const pct = (times.length / LIMITE) * 100;

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1>Meus Times</h1>
          <p>
            {times.length} de {LIMITE} times cadastrados
          </p>
        </div>
        <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          {totalPendentes > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
                background: "var(--amarelo-bg)",
                border: "1px solid rgba(255,215,0,.25)",
                borderRadius: "var(--radius)",
                padding: ".45rem .9rem",
                fontSize: ".84rem",
                color: "var(--amarelo)",
              }}
            >
              <FaBell /> {totalPendentes} pedido{totalPendentes > 1 ? "s" : ""}{" "}
              pendente{totalPendentes > 1 ? "s" : ""}
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={() => {
              if (times.length >= LIMITE) {
                toast.error(`Limite de ${LIMITE} times`);
                return;
              }
              setForm(VAZIO);
              setEditId(null);
              setModal("form");
            }}
            disabled={times.length >= LIMITE}
          >
            <FaPlus /> Novo Time
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div style={{ marginBottom: "2rem", maxWidth: 280 }}>
        <div
          style={{
            height: 5,
            background: "var(--borda)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                pct >= 100
                  ? "linear-gradient(90deg,#FFD700,#FF8C00)"
                  : "var(--verde-grad)",
              transition: "width .4s",
              borderRadius: 999,
            }}
          />
        </div>
        <span
          style={{
            fontSize: ".75rem",
            color: pct >= 100 ? "var(--amarelo)" : "var(--muted)",
            marginTop: ".3rem",
            display: "block",
          }}
        >
          {pct >= 100
            ? "⚠ Limite atingido — remova um para criar outro"
            : `Pode cadastrar mais ${LIMITE - times.length} time${LIMITE - times.length > 1 ? "s" : ""}`}
        </span>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--muted)",
          }}
        >
          Carregando...
        </div>
      ) : times.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "3rem", marginBottom: ".75rem" }}>👟</div>
          <p style={{ color: "var(--muted)", marginBottom: "1.25rem" }}>
            Você não tem times cadastrados.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(VAZIO);
              setEditId(null);
              setModal("form");
            }}
          >
            <FaPlus /> Cadastrar meu time
          </button>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {times.map((t) => {
            const memTime = membros[t.id] || [];
            const pendTime = pendentes[t.id] || [];

            return (
              <div key={t.id}>
                {/* Card do time */}
                <TimeCard
                  time={t}
                  membros={memTime}
                  acoes={
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={(el) => (fileRefs.current[t.id] = el)}
                        onChange={(e) => onEscudo(t.id, e)}
                      />
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => fileRefs.current[t.id]?.click()}
                        title="Trocar escudo"
                      >
                        <FaCamera />
                      </button>

                      <button
                        className={`btn btn-sm ${t.statusDesafio === "DISPONIVEL" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => disponib(t.id)}
                        style={{ flex: 1, justifyContent: "center" }}
                      >
                        {t.statusDesafio === "DISPONIVEL" ? (
                          <>
                            <FaToggleOn /> Disponível
                          </>
                        ) : (
                          <>
                            <FaToggleOff /> Inativo
                          </>
                        )}
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        title="Editar"
                        onClick={() => {
                          setForm({
                            nome: t.nome,
                            bairro: t.bairro,
                            cidade: t.cidade,
                            numerJogadores: t.numerJogadores,
                            horariosDisponiveis: t.horariosDisponiveis || "",
                          });
                          setEditId(t.id);
                          setModal("form");
                        }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-sm"
                        style={{
                          background: "var(--vermelho-bg)",
                          color: "var(--vermelho)",
                          border: "1px solid rgba(255,68,68,.25)",
                        }}
                        onClick={() => setConfirmDel(t)}
                        title="Remover"
                      >
                        <FaTrash />
                      </button>
                    </>
                  }
                />

                {/* Painel de solicitações pendentes */}
                {pendTime.length > 0 && (
                  <div
                    style={{
                      marginTop: ".75rem",
                      background: "rgba(255,215,0,.04)",
                      border: "1px solid rgba(255,215,0,.18)",
                      borderRadius: "var(--radius)",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".79rem",
                        fontWeight: 700,
                        color: "var(--amarelo)",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        marginBottom: ".75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: ".4rem",
                      }}
                    >
                      <FaBell /> {pendTime.length} solicitação
                      {pendTime.length > 1 ? "ões" : ""} aguardando resposta
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: ".6rem",
                      }}
                    >
                      {pendTime.map((s) => (
                        <div
                          key={s.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".75rem",
                            padding: ".65rem .85rem",
                            background: "var(--card)",
                            borderRadius: 8,
                            border: "1px solid var(--borda)",
                          }}
                        >
                          <AvatarJogador
                            usuario={{
                              nome: s.usuarioNome,
                              fotoPerfil: s.usuarioFoto,
                            }}
                            size={40}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: ".92rem",
                                color: "#fff",
                              }}
                            >
                              {s.usuarioNome}
                            </div>
                            <div
                              style={{
                                fontSize: ".77rem",
                                color: "var(--muted)",
                                marginTop: ".1rem",
                              }}
                            >
                              {s.usuarioPosicao && (
                                <span
                                  style={{
                                    color: "var(--verde-neon)",
                                    marginRight: 4,
                                  }}
                                >
                                  {s.usuarioPosicao} ·
                                </span>
                              )}
                              {s.tipo === "ENTRADA"
                                ? "🟢 Quer entrar no time"
                                : "🔴 Quer sair do time"}
                              {s.mensagem && (
                                <span style={{ color: "var(--muted2)" }}>
                                  {" "}
                                  — "{s.mensagem}"
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: ".4rem",
                              flexShrink: 0,
                            }}
                          >
                            <button
                              className="btn btn-xs"
                              style={{
                                background: "var(--vermelho-bg)",
                                color: "var(--vermelho)",
                                border: "1px solid rgba(255,68,68,.3)",
                              }}
                              onClick={() =>
                                responderSolicitacao(s.id, t.id, false)
                              }
                              title="Recusar"
                            >
                              <FaTimes />
                            </button>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() =>
                                responderSolicitacao(s.id, t.id, true)
                              }
                              title="Aprovar"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Painel de membros */}
                {memTime.length > 0 && (
                  <div
                    style={{
                      marginTop: ".75rem",
                      background: "rgba(100,200,100,.04)",
                      border: "1px solid rgba(100,200,100,.18)",
                      borderRadius: "var(--radius)",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".79rem",
                        fontWeight: 700,
                        color: "var(--verde-neon)",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        marginBottom: ".75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: ".4rem",
                      }}
                    >
                      👥 {memTime.length} jogador{memTime.length > 1 ? "es" : ""} no time
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: ".6rem",
                      }}
                    >
                      {memTime.map((m) => (
                        <div
                          key={m.usuarioId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".75rem",
                            padding: ".65rem .85rem",
                            background: "var(--card)",
                            borderRadius: 8,
                            border: "1px solid var(--borda)",
                          }}
                        >
                          <AvatarJogador
                            usuario={{
                              nome: m.usuarioNome,
                              fotoPerfil: m.usuarioFoto,
                            }}
                            size={40}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: ".92rem",
                                color: "#fff",
                              }}
                            >
                              {m.usuarioNome}
                            </div>
                            <div
                              style={{
                                fontSize: ".77rem",
                                color: "var(--muted)",
                                marginTop: ".1rem",
                              }}
                            >
                              {m.usuarioPosicao && (
                                <span
                                  style={{
                                    color: "var(--verde-neon)",
                                  }}
                                >
                                  ⚽ {m.usuarioPosicao}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            className="btn btn-xs"
                            style={{
                              background: "var(--vermelho-bg)",
                              color: "var(--vermelho)",
                              border: "1px solid rgba(255,68,68,.3)",
                              flexShrink: 0,
                            }}
                            onClick={() =>
                              setConfirmRemoverMembro({
                                timeId: t.id,
                                usuarioId: m.usuarioId,
                                usuarioNome: m.usuarioNome,
                              })
                            }
                            title="Remover jogador"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal criar/editar */}
      {modal === "form" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? "Editar Time" : "Novo Time"}</h2>
            <div className="form-group">
              <label>Nome do time *</label>
              <input
                placeholder="Ex: Flamengo do Bairro"
                value={form.nome}
                onChange={set("nome")}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 1rem",
              }}
            >
              <div className="form-group">
                <label>Bairro *</label>
                <input
                  placeholder="Centro"
                  value={form.bairro}
                  onChange={set("bairro")}
                />
              </div>
              <div className="form-group">
                <label>Cidade *</label>
                <input
                  placeholder="Extrema"
                  value={form.cidade}
                  onChange={set("cidade")}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Nº de jogadores</label>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="11"
                value={form.numerJogadores}
                onChange={set("numerJogadores")}
              />
            </div>
            <div className="form-group">
              <label>Horários disponíveis</label>
              <input
                placeholder="Sábados e domingos — tarde"
                value={form.horariosDisponiveis}
                onChange={set("horariosDisponiveis")}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={salvar}
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : editId
                    ? "Salvar Alterações"
                    : "Cadastrar Time"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar exclusão */}
      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Remover Time</h2>
            <p style={{ color: "var(--muted)", margin: ".5rem 0 1.5rem" }}>
              Remover{" "}
              <strong style={{ color: "#fff" }}>{confirmDel.nome}</strong>? Esta
              ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDel(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deletar(confirmDel.id)}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar remoção de membro */}
      {confirmRemoverMembro && (
        <div className="modal-overlay" onClick={() => setConfirmRemoverMembro(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Remover Jogador</h2>
            <p style={{ color: "var(--muted)", margin: ".5rem 0 1.5rem" }}>
              Remover{" "}
              <strong style={{ color: "#fff" }}>
                {confirmRemoverMembro.usuarioNome}
              </strong>{" "}
              do time? O jogador não poderá mais participar.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmRemoverMembro(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={removerMembro}
                disabled={salvando}
              >
                {salvando ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
