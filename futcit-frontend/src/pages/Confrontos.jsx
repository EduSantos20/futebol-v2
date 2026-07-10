import { useEffect, useState } from "react";
import { confrontosApi, jogosApi } from "../api";
import useAuth from "../store/authStore";
import { Escudo } from "../components/TimeCard";
import toast from "react-hot-toast";
import {
  FaFutbol,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function ConfrotoCard({ jogo, usuarioId, onRegistrarPlacar }) {
  const [expandido, setExpandido] = useState(false);
  const temPlacar = jogo.golsTimeDesafiante !== null && jogo.golsTimeDesafiado !== null;
  const podeRegistrar = usuarioId && (
    jogo.timeDesafiante.usuarioId === usuarioId ||
    jogo.timeDesafiado.usuarioId === usuarioId
  );

  const temCampo = jogo.temCampo && jogo.nomeCampo;

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".8rem",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onClick={() => setExpandido(!expandido)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: temPlacar
            ? "linear-gradient(90deg, var(--verde-neon), var(--verde))"
            : "linear-gradient(90deg, #FFD700, #FFA500)",
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
        <span
          style={{
            fontSize: ".75rem",
            color: "var(--muted2)",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <FaCalendarAlt style={{ color: "var(--verde-neon)" }} />
          {new Date(jogo.dataJogo + "T00:00:00").toLocaleDateString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
          {jogo.horarioJogo && <span>{jogo.horarioJogo.slice(0, 5)}</span>}
        </span>

        {expandido ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            <Escudo time={jogo.timeDesafiante} size={42} />
          </div>
          <div style={{ fontWeight: 700, fontSize: ".85rem", color: "#fff" }}>
            {jogo.timeDesafiante.nome}
          </div>
          <div
            style={{
              fontSize: ".7rem",
              color: "var(--muted)",
              marginTop: ".1rem",
            }}
          >
            {jogo.timeDesafiante.bairro}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            minWidth: "60px",
          }}
        >
          {temPlacar ? (
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "2rem",
                color: "var(--verde-neon)",
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              {jogo.golsTimeDesafiante}
              <span style={{ fontSize: "2.25rem", color: "var(--verde-neon)" }}>
                {" "}
                X{" "}
              </span>
              {jogo.golsTimeDesafiado}
            </div>
          ) : (
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "1.4rem",
                color: "var(--muted2)",
                letterSpacing: 2,
              }}
            >
              VS
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: ".35rem",
            }}
          >
            <Escudo time={jogo.timeDesafiado} size={42} />
          </div>
          <div style={{ fontWeight: 700, fontSize: ".85rem", color: "#fff" }}>
            {jogo.timeDesafiado.nome}
          </div>
          <div
            style={{
              fontSize: ".7rem",
              color: "var(--muted)",
              marginTop: ".1rem",
            }}
          >
            {jogo.timeDesafiado.bairro}
          </div>
        </div>
      </div>

      {expandido && (
        <>
          {temCampo && (
            <div
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid var(--borda)",
                borderRadius: 8,
                padding: ".65rem .9rem",
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
          )}

          {temPlacar && (
            <div
              style={{
                background: "rgba(76, 175, 80, 0.1)",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                borderRadius: 8,
                padding: ".65rem .9rem",
                fontSize: ".84rem",
                color: "var(--muted)",
              }}
            >
              <FaFutbol
                style={{
                  color: "var(--verde-neon)",
                  marginRight: ".5rem",
                }}
              />
              <strong style={{ color: "var(--verde-neon)" }}>Resultado registrado</strong>
            </div>
          )}

          {podeRegistrar && !temPlacar && (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onRegistrarPlacar(jogo);
              }}
              style={{ width: "100%" }}
            >
              <FaFutbol /> Registrar Placar
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function Confrontos() {
  const { usuario } = useAuth();
  const [confrontos, setConfrontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalPlacar, setModalPlacar] = useState(null);
  const [golsDesafiante, setGolsDesafiante] = useState("");
  const [golsDesafiado, setGolsDesafiado] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarConfrontos = (data) => {
    setLoading(true);
    confrontosApi
      .listar(data)
      .then(({ data: confrontosData }) => setConfrontos(confrontosData))
      .catch(() => toast.error("Erro ao carregar confrontos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarConfrontos(dataSelecionada);
  }, [dataSelecionada]);

  const abrirModalPlacar = (jogo) => {
    setModalPlacar(jogo);
    setGolsDesafiante("");
    setGolsDesafiado("");
  };

  const registrarPlacar = async () => {
    if (golsDesafiante === "" || golsDesafiado === "") {
      toast.error("Informe os dois placares");
      return;
    }
    setSalvando(true);
    try {
      await jogosApi.registrarPlacar(modalPlacar.id, {
        golsTimeDesafiante: parseInt(golsDesafiante),
        golsTimeDesafiado: parseInt(golsDesafiado),
      });
      toast.success("Placar registrado!");
      carregarConfrontos(dataSelecionada);
      setModalPlacar(null);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao registrar placar");
    } finally {
      setSalvando(false);
    }
  };

  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(new Date().getTime() + 86400000)
    .toISOString()
    .split("T")[0];
  const ontem = new Date(new Date().getTime() - 86400000)
    .toISOString()
    .split("T")[0];

  const atalhos = [
    { label: "Ontem", data: ontem },
    { label: "Hoje", data: hoje },
    { label: "Amanhã", data: amanha },
  ];

  return (
    <div className="container">
      <div style={{ padding: "2rem 1rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
          <FaFutbol style={{ marginRight: ".5rem" }} />
          Confrontos
        </h1>

        <div
          style={{
            display: "flex",
            gap: ".75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {atalhos.map((atalho) => (
            <button
              key={atalho.data}
              className={`btn btn-sm ${dataSelecionada === atalho.data ? "btn-primary" : ""}`}
              onClick={() => setDataSelecionada(atalho.data)}
              style={{
                background:
                  dataSelecionada === atalho.data
                    ? "var(--verde-neon)"
                    : "rgba(255,255,255,.05)",
                border: "1px solid var(--borda)",
              }}
            >
              {atalho.label}
            </button>
          ))}
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={{
              padding: ".5rem .75rem",
              background: "rgba(255,255,255,.03)",
              border: "1px solid var(--borda)",
              borderRadius: 6,
              color: "#fff",
              fontSize: ".9rem",
              cursor: "pointer",
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            Carregando confrontos...
          </div>
        ) : confrontos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--muted)",
              background: "rgba(255,255,255,.03)",
              borderRadius: 8,
              border: "1px solid var(--borda)",
            }}
          >
            <FaFutbol style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.5 }} />
            <p>Nenhum confronto marcado para essa data</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {confrontos.map((jogo) => (
              <ConfrotoCard
                key={jogo.id}
                jogo={jogo}
                usuarioId={usuario?.id}
                onRegistrarPlacar={abrirModalPlacar}
              />
            ))}
          </div>
        )}
      </div>

      {modalPlacar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setModalPlacar(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.25rem", marginBottom: ".5rem" }}>
              Registrar Placar
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
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

            <div
              style={{
                display: "flex",
                gap: ".75rem",
                justifyContent: "flex-end",
                paddingTop: ".75rem",
                borderTop: "1px solid var(--borda)",
              }}
            >
              <button
                className="btn btn-sm"
                onClick={() => setModalPlacar(null)}
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid var(--borda)",
                }}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={registrarPlacar}
                disabled={salvando}
              >
                {salvando ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
