import { FaMapMarkerAlt, FaUsers, FaClock } from "react-icons/fa";

export function Escudo({ time, size = 52 }) {
  if (time?.escudoUrl)
    return (
      <img
        src={time.escudoUrl}
        alt={time.nome}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: "2px solid rgba(50,205,50,.4)",
          boxShadow: "0 0 10px rgba(50,205,50,.2)",
        }}
      />
    );
  const nome = time?.nome || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,#32CD32 0%,#1a7a1a 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: size * 0.36 + "rem",
        boxShadow: "0 0 14px rgba(50,205,50,.3)",
        border: "2px solid rgba(50,205,50,.35)",
      }}
    >
      {nome.charAt(0)}
    </div>
  );
}

export function AvatarJogador({ usuario, size = 36 }) {
  if (usuario?.fotoPerfil)
    return (
      <img
        src={usuario.fotoPerfil}
        alt={usuario.nome}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--borda-hover)",
        }}
      />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(160,174,192,.15)",
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38 + "rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {(usuario?.nome || "?").charAt(0)}
    </div>
  );
}

export default function TimeCard({ time, acoes, membros }) {
  const disponivel = time.statusDesafio === "DISPONIVEL";

  return (
    <div
      className="card card-glow"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".85rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {disponivel && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            /*background: "linear-gradient(90deg,#32CD32,#00FF7F,#32CD32)",*/
            background: "linear-gradient(90deg,#00aeff,#0077b6,#00aeff)",
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
        <Escudo time={time} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {time.nome}
          </div>
          <div
            style={{
              fontSize: ".78rem",
              color: "var(--muted)",
              marginTop: ".1rem",
            }}
          >
            {time.usuarioNome}
          </div>
        </div>
        <span className={`badge ${disponivel ? "badge-green" : "badge-gray"}`}>
          {disponivel ? "● Disponível" : "○ Inativo"}
        </span>
      </div>

      {/* Infos */}
      <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            fontSize: ".84rem",
            color: "var(--muted)",
          }}
        >
          <FaMapMarkerAlt
            style={{
              color: "var(--verde-neon)",
              fontSize: ".75rem",
              flexShrink: 0,
            }}
          />
          {time.bairro}, {time.cidade}
        </div>
        {time.numerJogadores > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              fontSize: ".84rem",
              color: "var(--muted)",
            }}
          >
            <FaUsers
              style={{
                color: "var(--verde-neon)",
                fontSize: ".75rem",
                flexShrink: 0,
              }}
            />
            {time.numerJogadores} jogadores
          </div>
        )}
        {time.horariosDisponiveis && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              fontSize: ".84rem",
              color: "var(--muted)",
            }}
          >
            <FaClock
              style={{
                color: "var(--verde-neon)",
                fontSize: ".75rem",
                flexShrink: 0,
              }}
            />
            {time.horariosDisponiveis}
          </div>
        )}
      </div>

      {/* Membros (mini-avatares) */}
      {membros && membros.length > 0 && (
        <div>
          <div
            style={{
              fontSize: ".74rem",
              color: "var(--muted2)",
              marginBottom: ".4rem",
              textTransform: "uppercase",
              letterSpacing: ".5px",
              fontWeight: 600,
            }}
          >
            Jogadores ({membros.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
            {membros.map((m) => (
              <div
                key={m.id}
                title={`${m.usuarioNome} — ${m.posicao || "sem posição"}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: ".25rem",
                }}
              >
                <AvatarJogador
                  usuario={{ nome: m.usuarioNome, fotoPerfil: m.usuarioFoto }}
                  size={32}
                />
                <span
                  style={{
                    fontSize: ".62rem",
                    color: "var(--muted2)",
                    maxWidth: 40,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.posicao || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      {acoes && (
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            flexWrap: "wrap",
            marginTop: ".15rem",
            paddingTop: ".85rem",
            borderTop: "1px solid var(--borda)",
          }}
        >
          {acoes}
        </div>
      )}
    </div>
  );
}
