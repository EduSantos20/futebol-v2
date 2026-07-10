import { useEffect, useState } from 'react'
import { timesApi, solicitacoesApi } from '../api'
import TimeCard, { AvatarJogador } from '../components/TimeCard'
import useAuth from '../store/authStore'
import toast from 'react-hot-toast'
import { FaSearch, FaSignInAlt, FaSignOutAlt, FaUsers } from 'react-icons/fa'

export default function TimesParaJogador() {
  const { usuario } = useAuth()
  const [times, setTimes] = useState([])
  const [membros, setMembros] = useState({})
  const [meusMembros, setMeusMembros] = useState([]) // times que já faço parte
  const [minhasSol, setMinhasSol] = useState([])     // solicitações pendentes minhas
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalSaida, setModalSaida] = useState(null)
  const [motivoSaida, setMotivoSaida] = useState('')
  const [enviando, setEnviando] = useState(false)

  const carregar = async () => {
    try {
      const { data: ts } = await timesApi.publicos()
      setTimes(ts)
      const [memRes, solRes] = await Promise.all([
        Promise.allSettled(ts.map(t => solicitacoesApi.membros(t.id).then(r => ({ id:t.id, data:r.data })))),
        solicitacoesApi.minhas(),
      ])
      const map = {}
      memRes.forEach(r => { if (r.status==='fulfilled') map[r.value.id] = r.value.data })
      setMembros(map)
      setMinhasSol(solRes.data)
      // Times que já faço parte
      const meus = Object.entries(map).filter(([, ms]) => ms.some(m => m.usuarioId === usuario?.id)).map(([id]) => id)
      setMeusMembros(meus)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregar() }, [usuario])

  const jaSouMembro = timeId => meusMembros.includes(timeId)
  const temPendente = (timeId, tipo) => minhasSol.some(s => s.timeId===timeId && s.tipo===tipo && s.status==='PENDENTE')
  const totalMeus = meusMembros.length
  const LIMITE = 2

  const solicitarEntrada = async (timeId) => {
    if (totalMeus >= LIMITE) { toast.error(`Você já faz parte de ${LIMITE} times. Saia de um antes.`); return }
    try {
      await solicitacoesApi.entrar(timeId)
      toast.success('Solicitação enviada! Aguardando aprovação do dono.')
      const { data } = await solicitacoesApi.minhas()
      setMinhasSol(data)
    } catch (err) { toast.error(err.response?.data?.erro || 'Erro') }
  }

  const abrirSaida = (time) => { setModalSaida(time); setMotivoSaida('') }

  const solicitarSaida = async () => {
    setEnviando(true)
    try {
      await solicitacoesApi.sair(modalSaida.id, { mensagem: motivoSaida || null })
      toast.success('Solicitação de saída enviada! Aguardando confirmação do dono.')
      const { data } = await solicitacoesApi.minhas()
      setMinhasSol(data)
      setModalSaida(null)
    } catch (err) { toast.error(err.response?.data?.erro || 'Erro')
    } finally { setEnviando(false) }
  }

  const filtrados = times.filter(t =>
    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
    t.bairro.toLowerCase().includes(busca.toLowerCase()) ||
    t.cidade.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container" style={{ paddingBottom:'3rem' }}>
      <div className="page-header">
        <h1>Times da Cidade</h1>
        <p>Faça parte de um time — {totalMeus}/{LIMITE} times que você participa</p>
      </div>

      {/* Barra de limite */}
      <div style={{ marginBottom:'1.75rem', maxWidth:280 }}>
        <div style={{ height:5, background:'var(--borda)', borderRadius:999, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(totalMeus/LIMITE)*100}%`, background:totalMeus>=LIMITE?'linear-gradient(90deg,#FFD700,#FF8C00)':'var(--verde-grad)', transition:'width .4s', borderRadius:999 }} />
        </div>
        <span style={{ fontSize:'.75rem', color:totalMeus>=LIMITE?'var(--amarelo)':'var(--muted)', marginTop:'.3rem', display:'block' }}>
          {totalMeus>=LIMITE?'⚠ Você já está em 2 times. Saia de um para entrar em outro.':`Pode entrar em mais ${LIMITE-totalMeus} time${LIMITE-totalMeus>1?'s':''}`}
        </span>
      </div>

      {/* Meus times resumo */}
      {meusMembros.length > 0 && (
        <div style={{ marginBottom:'1.75rem' }}>
          <div style={{ fontSize:'.82rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'.75rem', display:'flex', alignItems:'center', gap:'.4rem' }}>
            <FaUsers style={{ color:'var(--verde)' }} /> Times que você participa
          </div>
          <div className="times-grid">
            {times.filter(t => meusMembros.includes(t.id)).map(t => (
              <TimeCard key={t.id} time={t} membros={membros[t.id]||[]} acoes={
                temPendente(t.id, 'SAIDA') ? (
                  <div style={{ fontSize:'.8rem', color:'var(--amarelo)', display:'flex', alignItems:'center', gap:'.4rem', width:'100%' }}>
                    ⏳ Solicitação de saída pendente
                  </div>
                ) : (
                  <button className="btn btn-sm" style={{ background:'var(--vermelho-bg)', color:'var(--vermelho)', border:'1px solid rgba(255,68,68,.25)', width:'100%', justifyContent:'center' }} onClick={() => abrirSaida(t)}>
                    <FaSignOutAlt /> Solicitar Saída
                  </button>
                )
              } />
            ))}
          </div>
        </div>
      )}

      {/* Busca */}
      <div style={{ position:'relative', maxWidth:440, marginBottom:'1.5rem' }}>
        <FaSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted2)', fontSize:'.85rem' }} />
        <input type="text" placeholder="Buscar times..." value={busca} onChange={e=>setBusca(e.target.value)}
          style={{ width:'100%', padding:'.65rem 1rem .65rem 2.5rem', background:'var(--card)', border:'1.5px solid var(--borda)', borderRadius:'var(--radius)', color:'var(--texto)', fontSize:'.92rem', fontFamily:'inherit' }} />
      </div>

      {/* Todos os times */}
      <div style={{ fontSize:'.82rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'.85rem' }}>
        Todos os times ({filtrados.length})
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>Carregando...</div>
      : filtrados.length === 0 ? (
        <div className="empty-state"><p>Nenhum time encontrado.</p></div>
      ) : (
        <div className="times-grid">
          {filtrados.map(t => {
            const souMembro = jaSouMembro(t.id)
            const pendEntrada = temPendente(t.id, 'ENTRADA')
            return (
              <TimeCard key={t.id} time={t} membros={membros[t.id]||[]} acoes={
                souMembro ? (
                  <span style={{ fontSize:'.8rem', color:'var(--verde)', fontWeight:700, display:'flex', alignItems:'center', gap:'.4rem' }}>✅ Você é membro</span>
                ) : pendEntrada ? (
                  <span style={{ fontSize:'.8rem', color:'var(--amarelo)', display:'flex', alignItems:'center', gap:'.4rem' }}>⏳ Solicitação pendente</span>
                ) : totalMeus >= LIMITE ? (
                  <span style={{ fontSize:'.8rem', color:'var(--muted2)' }}>Saia de um time para entrar</span>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center' }} onClick={() => solicitarEntrada(t.id)}>
                    <FaSignInAlt /> Solicitar Entrada
                  </button>
                )
              } />
            )
          })}
        </div>
      )}

      {/* Modal solicitar saída */}
      {modalSaida && (
        <div className="modal-overlay" onClick={() => setModalSaida(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Solicitar Saída do Time</h2>
            <p style={{ color:'var(--muted)', marginBottom:'1rem', fontSize:'.92rem' }}>
              Você está solicitando saída de <strong style={{ color:'#fff' }}>{modalSaida.nome}</strong>.<br />
              O dono do time precisará confirmar sua saída.
            </p>
            <div className="form-group">
              <label>Motivo (opcional)</label>
              <textarea rows={3} value={motivoSaida} onChange={e=>setMotivoSaida(e.target.value)} placeholder="Ex: Mudança de cidade, compromissos..." style={{ resize:'vertical' }} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModalSaida(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={solicitarSaida} disabled={enviando}>{enviando?'Enviando...':'Confirmar Solicitação'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
