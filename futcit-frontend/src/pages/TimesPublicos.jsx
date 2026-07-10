import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timesApi, solicitacoesApi } from "../api";
import useAuth from "../store/authStore";
import TimeCard from "../components/TimeCard";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

export default function TimesPublicos() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [times, setTimes] = useState([]);
  const [membros, setMembros] = useState({});
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timesApi
      .publicos()
      .then(async ({ data }) => {
        setTimes(data);
        // Carrega membros de todos os times em paralelo
        const resultados = await Promise.allSettled(
          data.map((t) =>
            solicitacoesApi
              .membros(t.id)
              .then((r) => ({ id: t.id, membros: r.data })),
          ),
        );
        const map = {};
        resultados.forEach((r) => {
          if (r.status === "fulfilled") map[r.value.id] = r.value.membros;
        });
        setMembros(map);
      })
      .catch(() => toast.error("Erro ao carregar times"))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = times.filter(
    (t) =>
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.bairro.toLowerCase().includes(busca.toLowerCase()) ||
      t.cidade.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(50,205,50,.15) 0%, rgba(30,60,220,.1) 100%)",
          borderBottom: "1px solid var(--borda)",
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%,rgba(50,205,50,.2) 0%,transparent 50%), radial-gradient(ellipse at 80% 80%,rgba(30,60,220,.15) 0%,transparent 50%)",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            {/* <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                background: "rgba(50,205,50,.1)",
                border: "1px solid rgba(50,205,50,.3)",
                borderRadius: 25,
                padding: ".2rem .9rem",
                fontSize: "1rem",
                color: "var(--verde)",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              <img src="../public/img/bola-removebg-preview.png" alt="Bola de futebol com as cores verde e azul " />
              Bem-vindo à Plataforma de Futebol
            </div>*/}

            <h1
              style={{
                fontSize: "2.8rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              Seu Time Pronto Para o{" "}
              <span style={{ background: "var(--verde-grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Próximo Jogo?
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--muted)",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              Gerencie seus times, organize partidas, acompanhe jogadores e
              marque desafios com outros times, 
              tudo em um único lugar.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {usuario?.tipoUsuario === "DONO" ? (
                <button
                  onClick={() => navigate("/meus-times")}
                  className="btn btn-primary"
                  style={{
                    padding: ".85rem 2rem",
                    fontSize: "1rem",
                    gap: ".6rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaTrophy /> Meus Times <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/registrar")}
                  className="btn btn-primary"
                  style={{
                    padding: ".85rem 2rem",
                    fontSize: "1rem",
                    gap: ".6rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaTrophy /> Cadastrar Meu Time <FaArrowRight />
                </button>
              )}
              <button
                onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
                className="btn btn-ghost"
                style={{
                  padding: ".85rem 2rem",
                  fontSize: "1rem",
                }}
              >
                Explorar Times
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE BENEFÍCIOS */}
      <div style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "3rem",
                color: "#fff",
              }}
            >
              Por que usar nossa plataforma?
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[
                {
                  icon: <FaUsers />,
                  titulo: "Gerencie Times",
                  desc: "Organize membros, acompanhe jogadores e mantenha tudo sob controle",
                },
                {
                  icon: <FaCalendarAlt />,
                  titulo: "Agende Partidas",
                  desc: "Marque desafios com outros times e organize seu calendário",
                },
                {
                  icon: <FaTrophy />,
                  titulo: "Compita & Vença",
                  desc: "Participe de partidas e acompanhe o desempenho do seu time",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--borda)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.75rem",
                    textAlign: "center",
                    transition: "all .3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--verde)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(50,205,50,.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--borda)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      color: "var(--verde)",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: ".5rem",
                      color: "#fff",
                    }}
                  >
                    {item.titulo}
                  </h3>
                  <p
                    style={{
                      fontSize: ".9rem",
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE TIMES CADASTRADOS */}
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div className="page-header">
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>Times Disponíveis</h2>
            <p>
              {times.length} times cadastrados na plataforma — encontre seu próximo desafio!
            </p>
          </div>
        </div>

        <div
          style={{ position: "relative", maxWidth: 440, marginBottom: "1.75rem" }}
        >
          <FaSearch
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted2)",
              fontSize: ".85rem",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nome, bairro ou cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: ".65rem 1rem .65rem 2.5rem",
              background: "var(--card)",
              border: "1.5px solid var(--borda)",
              borderRadius: "var(--radius)",
              color: "var(--texto)",
              fontSize: ".92rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--muted)",
            }}
          >
            Carregando times...
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "3rem", marginBottom: ".5rem" }}>⚽</div>
            <p>
              {times.length === 0
                ? "Nenhum time cadastrado ainda."
                : "Nenhum time encontrado com esse filtro."}
            </p>
          </div>
        ) : (
          <div className="times-grid">
            {filtrados.map((t) => (
              <TimeCard key={t.id} time={t} membros={membros[t.id] || []} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
