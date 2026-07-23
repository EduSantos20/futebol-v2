import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useAuth from "../store/authStore";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) navigate("/");
  }, [usuario]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/google`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, senha });
      login(data.token, data.usuario);
      toast.success(`Bem-vindo, ${data.usuario.nome.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.erro || "E-mail ou senha incorretos.");
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
        padding: "1rem",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%,rgba(50,205,50,.06) 0%,transparent 65%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--card)",
          border: "1px solid var(--borda)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
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
            <img src="../public/img/bola-removebg-preview.png" alt="Bola de futebol com as cores verde e azul " />
          </div>
          <h1 style={{ fontSize: "2rem", color: "#fff", letterSpacing: "1px" }}>
            FUTEBOL DA CIDADE
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              marginTop: ".4rem",
            }}
          >
            Entre para gerenciar seus times e jogos
          </p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>E-mail</label>
            <div style={{ position: "relative" }}>
              <FaEnvelope
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                  fontSize: ".85rem",
                }}
              />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "2.25rem", width: "100%" }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Senha</label>
            <div style={{ position: "relative" }}>
              <FaLock
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                  fontSize: ".85rem",
                }}
              />
              <input
                type={show ? "text" : "password"}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: ".8rem",
              fontSize: "1rem",
              marginTop: ".5rem",
            }}
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        <div style={{ marginTop: "1rem" }}>
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
        <p
          style={{
            textAlign: "center",
            marginTop: "1.75rem",
            fontSize: ".88rem",
            color: "var(--muted)",
          }}
        >
          Não tem conta?{" "}
          <Link
            to="/registrar"
            style={{ color: "var(--verde)", fontWeight: 700 }}
          >
            Cadastre-se
          </Link>
        </p>
        <p
          style={{
            textAlign: "center",
            marginTop: ".75rem",
            fontSize: ".88rem",
          }}
        >
          <Link
            to="/esqueceu-senha"
            style={{ color: "var(--verde)", fontWeight: 700 }}
          >
            Esqueceu a senha?
          </Link>
        </p>
      </div>
    </div>
  );
}
