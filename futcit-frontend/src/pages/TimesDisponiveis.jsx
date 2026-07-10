import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timesApi, jogosApi } from "../api";
import TimeCard from "../components/TimeCard";
import useAuth from "../store/authStore";
import { capitalize } from "../utils/capitalize";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt, FaBolt } from "react-icons/fa";

const FORM0 = {
  timeId: "",
  data: "",
  hora: "",
  temCampo: false,
  nomeCampo: "",
  localCampo: "",
};

export default function TimesDisponiveis() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [disponiveis, setDisponiveis] = useState([]);
  const [meusTimes, setMeusTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(FORM0);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    timesApi
      .disponiveis()
      .then(({ data }) => setDisponiveis(data))
      .catch(() => toast.error("Erro ao carregar"))
      .finally(() => setLoading(false));
    if (usuario?.tipoUsuario === "DONO")
      timesApi.meus().then(({ data }) => setMeusTimes(data));
  }, [usuario]);

  const abrir = (adv) => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    if (usuario.tipoUsuario !== "DONO") {
      toast.error("Apenas donos de time podem desafiar");
      return;
    }
    setModal(adv);
    setForm({ ...FORM0, timeId: meusTimes[0]?.id || "" });
  };

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    // Capitaliza campos de texto (primeira letra maiúscula, resto minúscula)
    const fieldsCapitalize = ["nomeCampo", "localCampo"];
    const valorFinal = fieldsCapitalize.includes(k) ? capitalize(v) : v;
    setForm((f) => ({ ...f, [k]: valorFinal }));
  };

  const enviar = async () => {
    if (!form.timeId) {
      toast.error("Selecione seu time");
      return;
    }
    if (!form.data) {
      toast.error("Informe a data do jogo");
      return;
    }
    if (form.temCampo && !form.nomeCampo) {
      toast.error("Informe o nome do campo");
      return;
    }
    setEnviando(true);
    try {
      await jogosApi.desafiar({
        timeDesafianteId: form.timeId,
        timeDesafiadoId: modal.id,
        dataJogo: form.data,
        horarioJogo: form.hora || null,
        temCampo: form.temCampo,
        nomeCampo: form.temCampo ? form.nomeCampo : null,
        localCampo: form.temCampo ? form.localCampo : null,
      });
      toast.success("Desafio enviado! Aguardando adversário aceitar.");
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao enviar desafio");
    } finally {
      setEnviando(false);
    }
  };

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div className="page-header">
        <h1>Procurando Jogo</h1>
        <p>Times disponíveis para marcar uma partida agora</p>
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
      ) : disponiveis.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "3rem", marginBottom: ".5rem" }}>🏟️</div>
          <p>Nenhum time procurando adversário agora.</p>
        </div>
      ) : (
        <div className="times-grid">
          {disponiveis.map((t) => (
            <TimeCard
              key={t.id}
              time={t}
              acoes={
                usuario?.id !== t.usuarioId &&
                usuario?.tipoUsuario === "DONO" ? (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => abrir(t)}
                  >
                    <FaBolt /> Desafiar Este Time
                  </button>
                ) : usuario?.tipoUsuario === "JOGADOR" ? (
                  <span style={{ fontSize: ".8rem", color: "var(--muted2)" }}>
                    Faça parte deste time em Meus Times
                  </span>
                ) : null
              }
            />
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".65rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--verde-grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaBolt style={{ color: "#fff", fontSize: ".9rem" }} />
              </div>
              <h2 style={{ margin: 0 }}>Enviar Desafio</h2>
            </div>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1.25rem",
                fontSize: ".92rem",
              }}
            >
              Desafiando <strong style={{ color: "#fff" }}>{modal.nome}</strong>
              . Preencha os detalhes:
            </p>
            {meusTimes.length === 0 ? (
              <div
                style={{
                  background: "var(--vermelho-bg)",
                  border: "1px solid rgba(255,68,68,.3)",
                  borderRadius: "var(--radius)",
                  padding: "1rem",
                  color: "#FF6B6B",
                  fontSize: ".9rem",
                }}
              >
                Você não tem times cadastrados.
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Seu time</label>
                  <select value={form.timeId} onChange={set("timeId")}>
                    {meusTimes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="divider-label">
                  <FaCalendarAlt style={{ color: "var(--verde)" }} /> Data e
                  horário
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0 1rem",
                  }}
                >
                  <div className="form-group">
                    <label>Data *</label>
                    <input
                      type="date"
                      min={hoje}
                      value={form.data}
                      onChange={set("data")}
                    />
                  </div>
                  <div className="form-group">
                    <label>Horário (opcional)</label>
                    <input
                      type="time"
                      value={form.hora}
                      onChange={set("hora")}
                    />
                  </div>
                </div>
                <div className="divider-label">
                  <FaMapMarkerAlt style={{ color: "var(--verde)" }} /> Local
                </div>
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, temCampo: !f.temCampo }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".8rem",
                    padding: ".8rem 1rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    background: form.temCampo
                      ? "rgba(50,205,50,.08)"
                      : "rgba(255,255,255,.03)",
                    border: `1.5px solid ${form.temCampo ? "var(--verde)" : "var(--borda)"}`,
                    borderRadius: "var(--radius)",
                    transition: "all .18s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.temCampo}
                    onChange={set("temCampo")}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: 17,
                      height: 17,
                      accentColor: "var(--verde)",
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: ".9rem",
                        color: form.temCampo ? "var(--verde)" : "var(--texto)",
                      }}
                    >
                      {form.temCampo
                        ? "✅ Campo confirmado"
                        : "Já tem campo reservado?"}
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted2)" }}>
                      {form.temCampo
                        ? "Informe nome e endereço abaixo"
                        : "Marque se já tiver campo garantido"}
                    </div>
                  </div>
                </div>
                {form.temCampo && (
                  <>
                    <div className="form-group">
                      <label>Nome do campo *</label>
                      <input
                        placeholder="Ex: Campo do Zé, Arena Municipal..."
                        value={form.nomeCampo}
                        onChange={set("nomeCampo")}
                      />
                    </div>
                    <div className="form-group">
                      <label>Endereço (opcional)</label>
                      <input
                        placeholder="Rua das Flores, 123 — Centro"
                        value={form.localCampo}
                        onChange={set("localCampo")}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancelar
              </button>
              {meusTimes.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={enviar}
                  disabled={enviando}
                >
                  {enviando ? (
                    "Enviando..."
                  ) : (
                    <>
                      <FaBolt /> Enviar Desafio
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
