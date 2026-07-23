import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCamera, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaUser, FaFutbol, FaTrophy } from "react-icons/fa";
import { authApi } from "../api";
import useAuth from "../store/authStore";
import { capitalize } from "../utils/capitalize";

const POSICOES = [
  "Goleiro",
  "Zagueiro",
  "Lateral Direito",
  "Lateral Esquerdo",
  "Volante",
  "Meia",
  "Meia-atacante",
  "Atacante",
  "Centroavante",
  "Ponta Direita",
  "Ponta Esquerda",
];

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario, atualizarUsuario } = useAuth();
  const fotoRef = useRef();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    tipoUsuario: "JOGADOR",
    posicao: "",
    fotoPerfil: "",
  });

  const isJogador = form.tipoUsuario === "JOGADOR";

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    setForm({
      nome: usuario.nome || "",
      email: usuario.email || "",
      telefone: usuario.telefone || "",
      cidade: usuario.cidade || "",
      tipoUsuario: usuario.tipoUsuario || "JOGADOR",
      posicao: usuario.posicao || "",
      fotoPerfil: usuario.fotoPerfil || "",
    });
    setPreview(usuario.fotoPerfil || null);
  }, [usuario, navigate]);

  const set = (k) => (e) => {
    const value = e.target.value;
    const fieldsCapitalize = ["nome", "cidade"];
    const valorFinal = fieldsCapitalize.includes(k) ? capitalize(value) : value;
    setForm((f) => ({ ...f, [k]: valorFinal }));
  };

  const onFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Foto máx 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm((f) => ({ ...f, fotoPerfil: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.nome?.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!form.telefone?.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (!validatePhone(form.telefone)) {
      toast.error("Telefone inválido. Use formato: (XX) XXXXX-XXXX");
      return;
    }

    if (!form.cidade?.trim()) {
      toast.error("Cidade é obrigatória");
      return;
    }

    if (isJogador && !form.posicao) {
      toast.error("Jogadores devem informar a posição");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone || null,
        cidade: form.cidade.trim() || null,
        tipoUsuario: form.tipoUsuario,
        posicao: isJogador ? form.posicao : null,
        fotoPerfil: form.fotoPerfil || null,
      };

      const { data } = await authApi.atualizarPerfil(payload);
      const usuarioAtualizado = data?.usuario || data?.user || data || { ...usuario, ...payload };

      atualizarUsuario(usuarioAtualizado);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const titulo = useMemo(() => {
    if (!form.tipoUsuario) return "Perfil";
    return form.tipoUsuario === "JOGADOR" ? "Perfil de Jogador" : "Perfil de Dono";
  }, [form.tipoUsuario]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "2rem 1rem 3rem",
        backgroundImage: "radial-gradient(ellipse at 50% 0%,rgba(50,205,50,.06) 0%,transparent 65%)",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: "var(--card)",
          border: "1px solid var(--borda)",
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h1 style={{ color: "#fff", marginBottom: ".35rem" }}>{titulo}</h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>Atualize seus dados e preferências de cadastro.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => fotoRef.current?.click()}
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                background: preview ? "transparent" : "rgba(50,205,50,.08)",
                border: `2px dashed ${preview ? "var(--verde)" : "var(--borda-hover)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {preview ? (
                <img src={preview} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <FaCamera style={{ fontSize: "1.4rem", color: "var(--muted)" }} />
              )}
            </div>
            <div
              onClick={() => fotoRef.current?.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "var(--verde-grad)",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px solid var(--card)",
              }}
            >
              <FaCamera style={{ fontSize: ".6rem", color: "#fff" }} />
            </div>
            <input ref={fotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFoto} />
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Nome completo</label>
            <div style={{ position: "relative" }}>
              <FaUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="text" value={form.nome} onChange={set("nome")} style={{ paddingLeft: "2.25rem", width: "100%" }} />
            </div>
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <div style={{ position: "relative" }}>
              <FaEnvelope style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="email" value={form.email} disabled style={{ paddingLeft: "2.25rem", width: "100%", opacity: 0.8 }} />
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de perfil</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div
                onClick={() => setForm((f) => ({ ...f, tipoUsuario: "JOGADOR", posicao: f.posicao || "" }))}
                style={{
                  padding: ".9rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  border: `2px solid ${form.tipoUsuario === "JOGADOR" ? "var(--verde)" : "var(--borda)"}`,
                  background: form.tipoUsuario === "JOGADOR" ? "rgba(50,205,50,.08)" : "rgba(255,255,255,.02)",
                  textAlign: "center",
                }}
              >
                <FaFutbol style={{ marginBottom: ".25rem", color: form.tipoUsuario === "JOGADOR" ? "var(--verde)" : "var(--muted)" }} />
                <div style={{ fontWeight: 700, color: "#fff" }}>Jogador</div>
              </div>
              <div
                onClick={() => setForm((f) => ({ ...f, tipoUsuario: "DONO", posicao: "" }))}
                style={{
                  padding: ".9rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  border: `2px solid ${form.tipoUsuario === "DONO" ? "var(--verde)" : "var(--borda)"}`,
                  background: form.tipoUsuario === "DONO" ? "rgba(50,205,50,.08)" : "rgba(255,255,255,.02)",
                  textAlign: "center",
                }}
              >
                <FaTrophy style={{ marginBottom: ".25rem", color: form.tipoUsuario === "DONO" ? "var(--verde)" : "var(--muted)" }} />
                <div style={{ fontWeight: 700, color: "#fff" }}>Dono</div>
              </div>
            </div>
          </div>

          {isJogador && (
            <div className="form-group">
              <label>Posição em campo</label>
              <select value={form.posicao} onChange={set("posicao")}>
                <option value="">Selecione sua posição...</option>
                {POSICOES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div className="form-group">
              <label>Telefone</label>
              <div style={{ position: "relative" }}>
                <FaPhone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input type="tel" value={form.telefone} onChange={set("telefone")} style={{ paddingLeft: "2.25rem", width: "100%" }} />
              </div>
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <div style={{ position: "relative" }}>
                <FaMapMarkerAlt style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input type="text" value={form.cidade} onChange={set("cidade")} style={{ paddingLeft: "2.25rem", width: "100%" }} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: ".85rem", marginTop: ".25rem" }}>
            {loading ? "Salvando..." : "SALVAR PERFIL"}
          </button>
        </form>
      </div>
    </div>
  );
}
