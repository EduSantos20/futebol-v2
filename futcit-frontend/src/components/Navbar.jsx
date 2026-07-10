import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../store/authStore";
import useNotificacoes from "../hooks/useNotificacoes";

// Componente para mostrar badge de notificação
function BadgeNotificacao({ count }) {
  if (!count || count === 0) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "20px",
        height: "20px",
        padding: "0 6px",
        marginLeft: "6px",
        background: "var(--vermelho)",
        color: "#fff",
        borderRadius: "10px",
        fontSize: "0.75rem",
        fontWeight: "bold",
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const isDono = usuario?.tipoUsuario === "DONO";
  const isJogador = usuario?.tipoUsuario === "JOGADOR";
  const [menuAberto, setMenuAberto] = useState(false);
  const { timesSolicitacoes, jogosPendentes } = useNotificacoes();

  const fecharMenu = () => setMenuAberto(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button
          className={`navbar-toggle ${menuAberto ? "active" : ""}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {usuario?.fotoPerfil && (
          <img className="navbar-avatar" src={usuario.fotoPerfil} alt={usuario.nome} />
        )}

        <NavLink to="/" className="navbar-brand" onClick={fecharMenu}>
          <img src="../public/img/bola-removebg-preview.png" alt="Bola de futebol com as cores verde e azul " />
          FUTEBOL <span>DA CIDADE</span>
        </NavLink>

        <div className={`navbar-links ${menuAberto ? "active" : ""}`}>
          <NavLink
            to="/times"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={fecharMenu}
          >
            Times
          </NavLink>
          <NavLink
            to="/disponiveis"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={fecharMenu}
          >
            Procurando Jogo
          </NavLink>
          <NavLink
            to="/confrontos"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={fecharMenu}
          >
            Confrontos
          </NavLink>

          {isDono && (
            <>
              <NavLink
                to="/meus-times"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={fecharMenu}
                style={{ display: "flex", alignItems: "center" }}
              >
                Meu Time
                <BadgeNotificacao count={timesSolicitacoes} />
              </NavLink>
              <NavLink
                to="/meus-jogos"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={fecharMenu}
                style={{ display: "flex", alignItems: "center" }}
              >
                Meus Jogos
                <BadgeNotificacao count={jogosPendentes} />
              </NavLink>
            </>
          )}

          {isJogador && (
            <>
              <NavLink
                to="/times-jogador"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={fecharMenu}
              >
                Meu Time
              </NavLink>
              <NavLink
                to="/meus-pedidos"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={fecharMenu}
              >
                Minhas Solicitações
              </NavLink>
            </>
          )}

          {usuario && (
            <button
              className="navbar-logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sair
            </button>
          )}
        </div>

        <div className="navbar-user">
          {usuario ? (
            <>
              {usuario.fotoPerfil && (
                <img src={usuario.fotoPerfil} alt={usuario.nome} />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span>{usuario.nome.split(" ")[0]}</span>
                <span
                  style={{
                    fontSize: ".7rem",
                    color: isJogador ? "var(--amarelo)" : "var(--verde)",
                    lineHeight: 1,
                  }}
                >
                  {isJogador ? "⚽ Jogador" : "🏆 Dono"}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                style={{ color: "#ccc", borderColor: "#444", marginLeft: "auto" }}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm" onClick={fecharMenu}>
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
