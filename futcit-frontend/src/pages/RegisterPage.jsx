import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useAuth from "../store/authStore";
import { capitalize } from "../utils/capitalize";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaFutbol,
  FaTrophy,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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

export default function RegisterPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const fotoRef = useRef();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    conf: "",
    telefone: "",
    cidade: "",
    fotoPerfil: "",
    tipoUsuario: "",
    posicao: "",
  });
  const [preview, setPreview] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userTypeSelected, setUserTypeSelected] = useState(false);

  useEffect(() => {
    if (usuario) navigate("/");
  }, [usuario]);

  const set = (k) => (e) => {
    const value = e.target.value;
    // Capitaliza campos de texto (primeira letra maiúscula, resto minúscula)
    const fieldsCapitalize = ["nome", "cidade"];
    const valorFinal = fieldsCapitalize.includes(k) ? capitalize(value) : value;
    setForm((f) => ({ ...f, [k]: valorFinal }));
  };

  const selectUserType = (tipoUsuario) => {
    setForm((f) => ({ ...f, tipoUsuario }));
    setUserTypeSelected(true);
  };

  const onFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Foto máx 2MB");
      return;
    }
    const r = new FileReader();
    r.onload = (ev) => {
      setPreview(ev.target.result);
      setForm((f) => ({ ...f, fotoPerfil: ev.target.result }));
    };
    r.readAsDataURL(file);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/google`;
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!form.nome || form.nome.trim() === "") {
      toast.error("Nome completo é obrigatório");
      return;
    }

    if (!form.email || form.email.trim() === "") {
      toast.error("E-mail é obrigatório");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("E-mail inválido");
      return;
    }

    if (!form.telefone || form.telefone.trim() === "") {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (!validatePhone(form.telefone)) {
      toast.error("Telefone inválido. Use formato: (XX) XXXXX-XXXX");
      return;
    }

    if (!form.cidade || form.cidade.trim() === "") {
      toast.error("Cidade é obrigatória");
      return;
    }

    if (!form.senha || form.senha.trim() === "") {
      toast.error("Senha é obrigatória");
      return;
    }

    if (form.senha.length < 6) {
      toast.error("Senha mínimo 6 caracteres");
      return;
    }

    if (!form.conf || form.conf.trim() === "") {
      toast.error("Confirmação de senha é obrigatória");
      return;
    }

    if (form.senha !== form.conf) {
      toast.error("Senhas não coincidem");
      return;
    }

    if (!form.fotoPerfil) {
      toast.error("Foto de perfil é obrigatória");
      return;
    }

    if (form.tipoUsuario === "JOGADOR" && !form.posicao) {
      toast.error("Jogadores devem informar a posição");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.registrar({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        tipoUsuario: form.tipoUsuario,
        posicao: form.tipoUsuario === "JOGADOR" ? form.posicao : null,
        telefone: form.telefone || null,
        cidade: form.cidade.trim() || null,
        fotoPerfil: form.fotoPerfil || null,
      });
      login(data.token, data.usuario);
      toast.success(`Bem-vindo, ${data.usuario.nome.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "1.5rem 1rem",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%,rgba(50,205,50,.05) 0%,transparent 60%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--card)",
          border: "1px solid var(--borda)",
          borderRadius: "var(--radius-lg)",
          padding: "2.25rem",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              margin: "0 auto .75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
            }}
          >
            <img
              src="../public/img/bola-removebg-preview.png"
              alt="Bola de futebol com as cores verde e azul "
            />
          </div>
          <h1 style={{ fontSize: "1.85rem", color: "#fff" }}>CRIAR CONTA</h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              marginTop: ".25rem",
            }}
          >
            Junte-se à plataforma de futebol
          </p>
        </div>

        {/* Seleção de perfil */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: ".5px",
              display: "block",
              marginBottom: ".6rem",
            }}
          >
            Você é:
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: ".75rem",
            }}
          >
            {[
              {
                v: "JOGADOR",
                icon: <FaFutbol />,
                titulo: "Jogador",
                desc: "Se inscreve em times, participa de partidas",
              },
              {
                v: "DONO",
                icon: <FaTrophy />,
                titulo: "Dono de Time",
                desc: "Cria e gerencia times, agenda jogos",
              },
            ].map((op) => (
              <div
                key={op.v}
                onClick={() => selectUserType(op.v)}
                style={{
                  padding: ".9rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  transition: "all .18s",
                  border: `2px solid ${form.tipoUsuario === op.v ? "var(--verde)" : "var(--borda)"}`,
                  background:
                    form.tipoUsuario === op.v
                      ? "rgba(50,205,50,.08)"
                      : "rgba(255,255,255,.02)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.4rem",
                    color:
                      form.tipoUsuario === op.v
                        ? "var(--verde)"
                        : "var(--muted)",
                    marginBottom: ".35rem",
                  }}
                >
                  {op.icon}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: ".88rem",
                    color: form.tipoUsuario === op.v ? "#fff" : "var(--muted)",
                  }}
                >
                  {op.titulo}
                </div>
                <div
                  style={{
                    fontSize: ".73rem",
                    color: "var(--muted2)",
                    marginTop: ".2rem",
                    lineHeight: 1.4,
                  }}
                >
                  {op.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!userTypeSelected && (
          <p
            style={{
              textAlign: "center",
              fontSize: ".82rem",
              color: "var(--muted2)",
              padding: "1.5rem 1rem",
              background: "rgba(50,205,50,.05)",
              borderRadius: "var(--radius)",
              marginTop: "1rem",
            }}
          >
            👆 Escolha acima como você deseja se registrar para continuar
          </p>
        )}

        {userTypeSelected && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".6rem",
                  border: "1px solid var(--borda)",
                  background: "rgba(255,255,255,.03)",
                  color: "#fff",
                  padding: ".8rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <FcGoogle size={18} />
                Entrar com Google
              </button>
            </div>
            {/* Foto */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => fotoRef.current.click()}
                  style={{
                    width: 72,
                    height: 72,
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
                    <img
                      src={preview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FaCamera
                      style={{ fontSize: "1.3rem", color: "var(--muted)" }}
                    />
                  )}
                </div>
                <div
                  onClick={() => fotoRef.current.click()}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "var(--verde-grad)",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid var(--card)",
                  }}
                >
                  <FaCamera style={{ fontSize: ".55rem", color: "#fff" }} />
                </div>
                <input
                  ref={fotoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onFoto}
                />
              </div>
            </div>
            <p
              style={{
                textAlign: "center",
                fontSize: ".74rem",
                color: "var(--muted2)",
                marginBottom: "1.25rem",
                marginTop: "-.5rem",
              }}
            >
              Foto de perfil *
            </p>

            <form onSubmit={submit}>
              <div className="form-group">
                <label>Nome completo *</label>
                <div style={{ position: "relative" }}>
                  <FaUser
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: ".82rem",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={form.nome}
                    onChange={set("nome")}
                    style={{ paddingLeft: "2.25rem", width: "100%" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>E-mail *</label>
                <div style={{ position: "relative" }}>
                  <FaEnvelope
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: ".82rem",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={set("email")}
                    style={{ paddingLeft: "2.25rem", width: "100%" }}
                  />
                </div>
              </div>

              {form.tipoUsuario === "JOGADOR" && (
                <div className="form-group">
                  <label>Posição em campo *</label>
                  <select value={form.posicao} onChange={set("posicao")}>
                    <option value="">Selecione sua posição...</option>
                    {POSICOES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 1rem",
                }}
              >
                <div className="form-group">
                  <label>Telefone *</label>
                  <div style={{ position: "relative" }}>
                    <FaPhone
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--muted)",
                        fontSize: ".82rem",
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="(35) 99999-9999"
                      value={form.telefone}
                      onChange={set("telefone")}
                      style={{ paddingLeft: "2.25rem", width: "100%" }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cidade *</label>
                  <div style={{ position: "relative" }}>
                    <FaMapMarkerAlt
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--muted)",
                        fontSize: ".82rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Extrema"
                      value={form.cidade}
                      onChange={set("cidade")}
                      style={{ paddingLeft: "2.25rem", width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Senha *{" "}
                  <span style={{ fontWeight: 400, color: "var(--muted2)" }}>
                    (mín. 6)
                  </span>
                </label>
                <div style={{ position: "relative" }}>
                  <FaLock
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: ".82rem",
                    }}
                  />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Crie uma senha"
                    value={form.senha}
                    onChange={set("senha")}
                    style={{
                      paddingLeft: "2.25rem",
                      paddingRight: "2.75rem",
                      width: "100%",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirmar senha *</label>
                <div style={{ position: "relative" }}>
                  <FaLock
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: ".82rem",
                    }}
                  />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={form.conf}
                    onChange={set("conf")}
                    style={{
                      paddingLeft: "2.25rem",
                      width: "100%",
                      borderColor:
                        form.conf && form.conf !== form.senha
                          ? "var(--vermelho)"
                          : undefined,
                    }}
                  />
                </div>
                {form.conf && form.conf !== form.senha && (
                  <span
                    style={{ fontSize: ".78rem", color: "var(--vermelho)" }}
                  >
                    Senhas não coincidem
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: ".8rem",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Criando..." : "CRIAR CONTA"}
              </button>
            </form>
          </>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: ".88rem",
            color: "var(--muted)",
          }}
        >
          Já tem conta?{" "}
          <Link to="/login" style={{ color: "var(--verde)", fontWeight: 700 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
