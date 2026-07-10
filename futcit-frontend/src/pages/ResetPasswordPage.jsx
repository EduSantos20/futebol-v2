import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api";
import toast from "react-hot-toast";
import { FaLock, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    senha: "",
    conf: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "var(--card)",
            border: "1px solid var(--borda)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            maxWidth: 400,
          }}
        >
          <h2 style={{ color: "#ff4757", marginBottom: "1rem" }}>Link Inválido</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            O link de reset é inválido ou expirou. Por favor, solicite um novo.
          </p>
          <button
            onClick={() => navigate("/esqueceu-senha")}
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: ".8rem",
            }}
          >
            Solicitar novo link
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    if (!form.senha || !form.conf) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (form.senha.length < 6) {
      toast.error("Senha mínimo 6 caracteres");
      return;
    }

    if (form.senha !== form.conf) {
      toast.error("Senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        token,
        senha: form.senha,
      });
      setSucesso(true);
      toast.success("Senha redefinida com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
        {sucesso ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                margin: "0 auto 1rem",
                background: "linear-gradient(135deg,#32CD32,#1a7a1a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                boxShadow: "0 0 24px rgba(50,205,50,.35)",
              }}
            >
              <FaCheck style={{ color: "#fff" }} />
            </div>
            <h1 style={{ fontSize: "1.75rem", color: "#fff" }}>SUCESSO!</h1>
            <p style={{ color: "var(--muted)", marginTop: ".5rem" }}>
              Sua senha foi redefinida. Redirecionando para login...
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  margin: "0 auto .75rem",
                  background: "linear-gradient(135deg,#32CD32,#1a7a1a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  boxShadow: "0 0 24px rgba(50,205,50,.35)",
                }}
              >
                🔐
              </div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  color: "#fff",
                  letterSpacing: "1px",
                }}
              >
                NOVA SENHA
              </h1>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".88rem",
                  marginTop: ".5rem",
                }}
              >
                Digite sua nova senha
              </p>
            </div>

            <form onSubmit={submit}>
              <div className="form-group">
                <label>
                  Nova Senha{" "}
                  <span
                    style={{ fontWeight: 400, color: "var(--muted2)" }}
                  >
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
                      fontSize: ".85rem",
                    }}
                  />
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Crie uma nova senha"
                    value={form.senha}
                    onChange={set("senha")}
                    style={{
                      paddingLeft: "2.25rem",
                      paddingRight: "2.75rem",
                      width: "100%",
                    }}
                    disabled={loading}
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
                <label>Confirmar Senha</label>
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
                    placeholder="Repita a nova senha"
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
                    disabled={loading}
                  />
                </div>
                {form.conf && form.conf !== form.senha && (
                  <span style={{ fontSize: ".78rem", color: "var(--vermelho)" }}>
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
                  marginTop: ".5rem",
                }}
              >
                {loading ? "Atualizando..." : "REDEFINIR SENHA"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
