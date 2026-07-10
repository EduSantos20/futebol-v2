import { useEffect, useState } from "react";
import { jogosApi } from "../api";
import useAuth from "../store/authStore";
import { Escudo } from "../components/TimeCard";
import toast from "react-hot-toast";
import {
  FaFutbol,
  FaTimes,
  FaCheck,
  FaBan,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const STATUS = {
  PENDENTE: {
    label: "Pendente",
    cls: "badge-yellow",
    icon: <FaHourglassHalf />,
  },
  CONFIRMADO: {
    label: "Confirmado",
    cls: "badge-green",
    icon: <FaCheckCircle />,
  },
  RECUSADO: { label: "Recusado", cls: "badge-red", icon: <FaTimesCircle /> },
  CANCELADO: { label: "Cancelado", cls: "badge-red", icon: <FaTimesCircle /> },
};

function JogoCard({ jogo, usuarioId, onAceitar, onRecusar, onCancelar, onRegistrarPlacar }) {
  const ehDesafiante = jogo.timeDesafiante.usuarioId === usuarioId;
  const meu = ehDesafiante ? jogo.timeDesafiante : jogo.timeDesafiado;
  const adv = ehDesafiante ? jogo.timeDesafiado : jogo.timeDesafiante;
  const st = STATUS[jogo.status];
  const temPlacar = jogo.golsTimeDesafiante !== null && jogo.golsTimeDesafiado !== null;

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            jogo.status === "CONFIRMADO"
              ? "var(--verde-grad)"
              : jogo.status === "PENDENTE"
                ? "linear-gradient(90deg,#FFD700,#FFA500)"
                : "linear-gradient(90deg,#FF4444,#FF6B6B)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: ".25rem",
        }}
      >
        <span className={`badge ${st.cls}`}>
          {st.icon} {st.label}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted2)" }}>
          {new Date(jogo.criadoEm).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: ".35rem",
            }}
          >
            <Escudo time={meu} size={46} />
          </div>
          <div style={{ fontWeight: 700, fontSize: ".9rem", color: "#fff" }}>
            {meu.nome}
          </div>
          <div
            style={{
              fontSize: ".7rem",
              color: "var(--verde)",
              fontWeight: 700,
              marginTop: ".1rem",
            }}
          >
            MEU TIME
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "1.6rem",
            color: "var(--muted2)",
            letterSpacing: 2,
          }}
        >
          VS
        </div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: ".35rem",
            }}
          >
            <Escudo time={adv} size={46} />
          </div>
          <div style={{ fontWeight: 700, fontSize: ".9rem", color: "#fff" }}>
            {adv.nome}
          </div>
          <div
            style={{
              fontSize: ".7rem",
              color: "var(--muted)",
              marginTop: ".1rem",
            }}
          >
            {adv.bairro}
          </div>
        </div>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,.03)",
          border: "1px solid var(--borda)",
          borderRadius: 8,
          padding: ".65rem .9rem",
          display: "flex",
          flexDirection: "column",
          gap: ".35rem",
        }}
      >
        {jogo.dataJogo && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              fontSize: ".84rem",
              color: "var(--muted)",
            }}
          >
            <FaCalendarAlt
              style={{
                color: "var(--verde-neon)",
                flexShrink: 0,
                fontSize: ".8rem",
              }}
            />
            <span>
              <strong style={{ color: "#fff" }}>
                {new Date(jogo.dataJogo + "T00:00:00").toLocaleDateString(
                  "pt-BR",
                  { weekday: "long", day: "2-digit", month: "long" },
                )}
              </strong>
              {jogo.horarioJogo && (
                <span> — {jogo.horarioJogo.slice(0, 5)}</span>
              )}
            </span>
          </div>
        )}
        {jogo.temCampo && jogo.nomeCampo ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: ".5rem",
              fontSize: ".84rem",
              color: "var(--muted)",
            }}
          >
            <FaMapMarkerAlt
              style={{
                color: "var(--verde-neon)",
                marginTop: 2,
                flexShrink: 0,
                fontSize: ".8rem",
              }}
            />
            <span>
              <strong style={{ color: "#fff" }}>{jogo.nomeCampo}</strong>
              {jogo.localCampo && <span> · {jogo.localCampo}</span>}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              fontSize: ".83rem",
              color: "var(--amarelo)",
            }}
          >
            <FaMapMarkerAlt style={{ flexShrink: 0, fontSize: ".8rem" }} />{" "}
            Campo ainda não definido
          </div>
        )}
      </div>
      {jogo.status === "PENDENTE" && ehDesafiante && (
        <div className="alerta-amarelo" style={{ fontSize: ".83rem" }}>
          <FaHourglassHalf style={{ flexShrink: 0 }} /> Aguardando{" "}
          <strong style={{ margin: "0 4px" }}>{adv.nome}</strong> aceitar…
        </div>
      )}
      {jogo.status === "RECUSADO" && jogo.motivoRecusa && (
        <div
          style={{
            background: "var(--vermelho-bg)",
            border: "1px solid rgba(255,68,68,.25)",
            borderRadius: 8,
            padding: ".55rem .85rem",
            fontSize: ".83rem",
            color: "#FF6B6B",
          }}
        >
          <strong>Recusa:</strong> {jogo.motivoRecusa}
        </div>
      )}
      {jogo.status === "CANCELADO" && jogo.observacaoCancelamento && (
        <div
          style={{
            background: "var(--vermelho-bg)",
            border: "1px solid rgba(255,68,68,.25)",
            borderRadius: 8,
            padding: ".55rem .85rem",
            fontSize: ".83rem",
            color: "#FF6B6B",
          }}
        >
          <strong>Cancelamento:</strong> {jogo.observacaoCancelamento}
          {jogo.canceladoPorNome && (
            <>
              {" "}
              · por <em>{jogo.canceladoPorNome}</em>
            </>
          )}
        </div>
      )}
      {((jogo.status === "PENDENTE" && !ehDesafiante) ||
        jogo.status === "CONFIRMADO") && (
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            paddingTop: ".65rem",
            borderTop: "1px solid var(--borda)",
          }}
        >
          {jogo.status === "PENDENTE" && !ehDesafiante && (
            <>
              <button
                className="btn btn-sm"
                style={{
                  background: "var(--vermelho-bg)",
                  color: "var(--vermelho)",
                  border: "1px solid rgba(255,68,68,.3)",
                }}
                onClick={() => onRecusar(jogo)}
              >
                <FaBan /> Recusar
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onAceitar(jogo.id)}
              >
                <FaCheck /> Aceitar
              </button>
            </>
          )}
          {jogo.status === "CONFIRMADO" && (
            <>
              {!temPlacar && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onRegistrarPlacar(jogo)}
                >
                  <FaFutbol /> Registrar Placar
                </button>
              )}
              <button
                className="btn btn-sm"
                style={{
                  background: "var(--vermelho-bg)",
                  color: "var(--vermelho)",
                  border: "1px solid rgba(255,68,68,.3)",
                }}
                onClick={() => onCancelar(jogo)}
              >
                <FaTimes /> Cancelar Jogo
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MeusJogos() {
  const { usuario } = useAuth();
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("TODOS");
  const [modalRecusar, setModalRecusar] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [modalCancelar, setModalCancelar] = useState(null);
  const [obs, setObs] = useState("");
  const [modalPlacar, setModalPlacar] = useState(null);
  const [golsDesafiante, setGolsDesafiante] = useState("");
  const [golsDesafiado, setGolsDesafiado] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    jogosApi
      .meus()
      .then(({ data }) => setJogos(data))
      .catch(() => toast.error("Erro ao carregar jogos"))
      .finally(() => setLoading(false));
  }, []);

  const pendentesParaMim = jogos.filter(
    (j) => j.status === "PENDENTE" && j.timeDesafiado.usuarioId === usuario?.id,
  ).length;
  const cont = (s) => jogos.filter((j) => j.status === s).length;

  const aceitar = async (id) => {
    try {
      const { data } = await jogosApi.responder(id, { aceitar: true });
      setJogos((p) => p.map((j) => (j.id === id ? data : j)));
      toast.success("Jogo confirmado!");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro");
    }
  };
  const recusar = async () => {
    setSalvando(true);
    try {
      const { data } = await jogosApi.responder(modalRecusar.id, {
        aceitar: false,
        motivoRecusa: motivo || null,
      });
      setJogos((p) => p.map((j) => (j.id === data.id ? data : j)));
      toast.success("Desafio recusado.");
      setModalRecusar(null);
      setMotivo("");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro");
    } finally {
      setSalvando(false);
    }
  };
  const cancelar = async () => {
    if (!obs.trim()) {
      toast.error("Informe o motivo");
      return;
    }
    setSalvando(true);
    try {
      const { data } = await jogosApi.cancelar(modalCancelar.id, {
        observacao: obs,
      });
      setJogos((p) => p.map((j) => (j.id === data.id ? data : j)));
      toast.success("Jogo cancelado.");
      setModalCancelar(null);
      setObs("");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro");
    } finally {
      setSalvando(false);
    }
  };

  const registrarPlacar = async () => {
    if (golsDesafiante === "" || golsDesafiado === "") {
      toast.error("Informe os dois placares");
      return;
    }
    setSalvando(true);
    try {
      const { data } = await jogosApi.registrarPlacar(modalPlacar.id, {
        golsTimeDesafiante: parseInt(golsDesafiante),
        golsTimeDesafiado: parseInt(golsDesafiado),
      });
      setJogos((p) => p.map((j) => (j.id === data.id ? data : j)));
      toast.success("Placar registrado!");
      setModalPlacar(null);
      setGolsDesafiante("");
      setGolsDesafiado("");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao registrar placar");
    } finally {
      setSalvando(false);
    }
  };

  const filtros = [
    { k: "TODOS", l: "Todos" },
    {
      k: "PENDENTE",
      l: pendentesParaMim > 0 ? `Pendentes (${pendentesParaMim})` : "Pendentes",
    },
    { k: "CONFIRMADO", l: "Confirmados" },
    { k: "RECUSADO", l: "Recusados" },
    { k: "CANCELADO", l: "Cancelados" },
  ];
  const lista = jogos.filter((j) => filtro === "TODOS" || j.status === filtro);

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div className="page-header">
        <h1>Meus Jogos</h1>
        <p>Desafios pendentes, jogos confirmados e histórico</p>
      </div>
      <div
        style={{
          display: "flex",
          gap: ".85rem",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { l: "Pendentes", s: "PENDENTE", c: "var(--amarelo)" },
          { l: "Confirmados", s: "CONFIRMADO", c: "var(--verde)" },
          { l: "Cancelados", s: "CANCELADO", c: "var(--vermelho)" },
        ].map((x) => (
          <div
            key={x.s}
            style={{
              background: "var(--card)",
              border: "1px solid var(--borda)",
              borderRadius: "var(--radius)",
              padding: ".85rem 1.35rem",
              textAlign: "center",
              minWidth: 120,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue'",
                fontSize: "2rem",
                color: x.c,
                lineHeight: 1,
              }}
            >
              {cont(x.s)}
            </div>
            <div
              style={{
                fontSize: ".78rem",
                color: "var(--muted)",
                marginTop: ".2rem",
              }}
            >
              {x.l}
            </div>
          </div>
        ))}
      </div>
      {pendentesParaMim > 0 && (
        <div className="alerta-amarelo" style={{ marginBottom: "1.25rem" }}>
          <FaHourglassHalf style={{ flexShrink: 0, fontSize: "1.1rem" }} />
          <span>
            Você tem <strong>{pendentesParaMim}</strong> desafio
            {pendentesParaMim > 1 ? "s" : ""} aguardando resposta!
          </span>
          <button
            className="btn btn-xs"
            style={{
              marginLeft: "auto",
              background: "rgba(255,215,0,.2)",
              color: "var(--amarelo)",
              border: "1px solid rgba(255,215,0,.3)",
              fontWeight: 700,
            }}
            onClick={() => setFiltro("PENDENTE")}
          >
            Ver agora
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: ".4rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {filtros.map((f) => (
          <button
            key={f.k}
            className={`btn btn-sm ${filtro === f.k ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFiltro(f.k)}
          >
            {f.l}
          </button>
        ))}
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
      ) : lista.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>
            <FaFutbol style={{ color: "var(--muted2)" }} />
          </div>
          <p>Nenhum jogo encontrado.</p>
        </div>
      ) : (
        <div className="jogos-list">
          {lista.map((j) => (
            <JogoCard
              key={j.id}
              jogo={j}
              usuarioId={usuario?.id}
              onAceitar={aceitar}
              onRecusar={(j) => {
                setModalRecusar(j);
                setMotivo("");
              }}
              onCancelar={(j) => {
                setModalCancelar(j);
                setObs("");
              }}
              onRegistrarPlacar={(j) => {
                setModalPlacar(j);
                setGolsDesafiante("");
                setGolsDesafiado("");
              }}
            />
          ))}
        </div>
      )}
      {modalRecusar && (
        <div className="modal-overlay" onClick={() => setModalRecusar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Recusar Desafio</h2>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1rem",
                fontSize: ".92rem",
              }}
            >
              Recusando o desafio de{" "}
              <strong style={{ color: "#fff" }}>
                {modalRecusar.timeDesafiante.nome}
              </strong>
              .
            </p>
            <div className="form-group">
              <label>Motivo (opcional)</label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Já tenho jogo nessa data..."
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setModalRecusar(null)}
              >
                Voltar
              </button>
              <button
                className="btn btn-danger"
                onClick={recusar}
                disabled={salvando}
              >
                {salvando ? "Recusando..." : "Confirmar Recusa"}
              </button>
            </div>
          </div>
        </div>
      )}
      {modalCancelar && (
        <div className="modal-overlay" onClick={() => setModalCancelar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cancelar Jogo</h2>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1rem",
                fontSize: ".92rem",
              }}
            >
              O adversário será notificado e voltará à lista de disponíveis.
            </p>
            <div className="form-group">
              <label>Motivo *</label>
              <textarea
                rows={3}
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Ex: Não consigo comparecer..."
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setModalCancelar(null)}
              >
                Voltar
              </button>
              <button
                className="btn btn-danger"
                onClick={cancelar}
                disabled={salvando}
              >
                {salvando ? "Cancelando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
      {modalPlacar && (
        <div className="modal-overlay" onClick={() => setModalPlacar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Placar</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ marginBottom: ".75rem" }}>
                  <Escudo time={modalPlacar.timeDesafiante} size={40} />
                </div>
                <p
                  style={{
                    fontSize: ".9rem",
                    fontWeight: 700,
                    marginBottom: ".5rem",
                    color: "#fff",
                  }}
                >
                  {modalPlacar.timeDesafiante.nome}
                </p>
                <input
                  type="number"
                  min="0"
                  value={golsDesafiante}
                  onChange={(e) => setGolsDesafiante(e.target.value)}
                  style={{
                    width: "100%",
                    padding: ".65rem",
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid var(--borda)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                  placeholder="0"
                />
              </div>

              <div
                style={{
                  fontSize: "1.2rem",
                  color: "var(--muted2)",
                  marginBottom: ".75rem",
                }}
              >
                ×
              </div>

              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ marginBottom: ".75rem" }}>
                  <Escudo time={modalPlacar.timeDesafiado} size={40} />
                </div>
                <p
                  style={{
                    fontSize: ".9rem",
                    fontWeight: 700,
                    marginBottom: ".5rem",
                    color: "#fff",
                  }}
                >
                  {modalPlacar.timeDesafiado.nome}
                </p>
                <input
                  type="number"
                  min="0"
                  value={golsDesafiado}
                  onChange={(e) => setGolsDesafiado(e.target.value)}
                  style={{
                    width: "100%",
                    padding: ".65rem",
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid var(--borda)",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setModalPlacar(null)}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={registrarPlacar}
                disabled={salvando}
              >
                {salvando ? "Registrando..." : "Registrar Placar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
