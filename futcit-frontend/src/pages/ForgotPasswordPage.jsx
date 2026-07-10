import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import toast from "react-hot-toast";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Informe seu e-mail");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setEnviado(true);
      toast.success("Verifique seu e-mail para instruções de reset");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao solicitar reset");
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
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              margin: "0 auto .75rem",
              backgroundImage: "url('../public/img/bola-removebg-preview.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
            }}
          >
          </div>
          <h1 style={{ fontSize: "1.75rem", color: "#fff", letterSpacing: "1px" }}>
            {enviado ? "VERIFIQUE SEU E-MAIL" : "RECUPERAR SENHA"}
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              marginTop: ".5rem",
            }}
          >
            {enviado
              ? "Enviamos um link para redefinir sua senha"
              : "Digite seu e-mail para receber instruções"}
          </p>
        </div>

        {!enviado ? (
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
                  disabled={loading}
                />
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
              {loading ? "Enviando..." : "ENVIAR LINK"}
            </button>
          </form>
        ) : (
          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: ".8rem",
                fontSize: "1rem",
              }}
            >
              VOLTAR PARA LOGIN
            </button>
          </div>
        )}

        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".5rem",
            marginTop: "1.75rem",
            fontSize: ".88rem",
            color: "var(--muted)",
            textDecoration: "none",
            transition: "color .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--verde)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <FaArrowLeft size={14} />
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
