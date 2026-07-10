import { useEffect, useState } from 'react'
import { solicitacoesApi } from '../api'
import toast from 'react-hot-toast'
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'

const STATUS_INFO = {
  PENDENTE:  { cls:'badge-yellow', icon:<FaHourglassHalf />,  label:'Pendente' },
  APROVADO:  { cls:'badge-green',  icon:<FaCheckCircle />,    label:'Aprovado' },
  RECUSADO:  { cls:'badge-red',    icon:<FaTimesCircle />,    label:'Recusado' },
}

export default function MeusPedidos() {
  const [solicitacoes, setSolicitacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('TODOS')

  useEffect(() => {
    solicitacoesApi.minhas()
      .then(({ data }) => setSolicitacoes(data))
      .catch(() => toast.error('Erro ao carregar solicitações'))
      .finally(() => setLoading(false))
  }, [])

  const pendentes = solicitacoes.filter(s => s.status === 'PENDENTE').length
  const filtros = [
    { k:'TODOS',   l:'Todas' },
    { k:'PENDENTE',l: pendentes > 0 ? `Pendentes (${pendentes})` : 'Pendentes' },
    { k:'APROVADO',l:'Aprovadas' },
    { k:'RECUSADO',l:'Recusadas' },
  ]
  const lista = solicitacoes.filter(s => filtro === 'TODOS' || s.status === filtro)

  return (
    <div className="container" style={{ paddingBottom:'3rem' }}>
      <div className="page-header">
        <h1>Minhas Solicitações</h1>
        <p>Histórico de pedidos de entrada e saída de times</p>
      </div>

      {pendentes > 0 && (
        <div className="alerta-amarelo" style={{ marginBottom:'1.5rem' }}>
          <FaHourglassHalf style={{ flexShrink:0 }} />
          <span>Você tem <strong>{pendentes}</strong> solicitação{pendentes>1?'ões':''} aguardando resposta do dono do time.</span>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display:'flex', gap:'.4rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {filtros.map(f => (
          <button key={f.k} className={`btn btn-sm ${filtro===f.k?'btn-primary':'btn-ghost'}`} onClick={() => setFiltro(f.k)}>{f.l}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>Carregando...</div>
      : lista.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📋</div>
          <p>Nenhuma solicitação encontrada.</p>
          <p style={{ fontSize:'.85rem', color:'var(--muted2)', marginTop:'.4rem' }}>
            Acesse <strong style={{ color:'var(--verde)' }}>Meus Times</strong> para solicitar entrada em um time.
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          {lista.map(s => {
            const st = STATUS_INFO[s.status]
            const isEntrada = s.tipo === 'ENTRADA'
            return (
              <div key={s.id} className="card" style={{ position:'relative', overflow:'hidden' }}>
                {/* Linha colorida */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: s.status==='APROVADO'?'var(--verde-grad)':s.status==='RECUSADO'?'linear-gradient(90deg,#FF4444,#FF6B6B)':'linear-gradient(90deg,#FFD700,#FFA500)' }} />

                <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginTop:'.25rem' }}>
                  {/* Ícone tipo */}
                  <div style={{ width:42, height:42, borderRadius:'50%', flexShrink:0, background: isEntrada?'rgba(50,205,50,.1)':'var(--vermelho-bg)', border:`1.5px solid ${isEntrada?'rgba(50,205,50,.3)':'rgba(255,68,68,.3)'}`, display:'flex', alignItems:'center', justifyContent:'center', color: isEntrada?'var(--verde)':'var(--vermelho)', fontSize:'1rem' }}>
                    {isEntrada ? <FaSignInAlt /> : <FaSignOutAlt />}
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.6rem', flexWrap:'wrap', marginBottom:'.3rem' }}>
                      <span style={{ fontWeight:700, fontSize:'1rem', color:'#fff' }}>{s.timeNome}</span>
                      <span className={`badge ${st.cls}`}>{st.icon} {st.label}</span>
                      <span style={{ fontSize:'.73rem', color:'var(--muted2)', background:'rgba(255,255,255,.05)', padding:'.15rem .5rem', borderRadius:999, border:'1px solid var(--borda)' }}>
                        {isEntrada ? 'Entrada' : 'Saída'}
                      </span>
                    </div>

                    {s.mensagem && (
                      <div style={{ fontSize:'.83rem', color:'var(--muted)', fontStyle:'italic', marginBottom:'.35rem' }}>
                        "{s.mensagem}"
                      </div>
                    )}

                    <div style={{ fontSize:'.76rem', color:'var(--muted2)' }}>
                      Enviada em {new Date(s.criadoEm).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
                      {s.respondidoEm && (
                        <span> · Respondida em {new Date(s.respondidoEm).toLocaleDateString('pt-BR', { day:'2-digit', month:'long' })}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
