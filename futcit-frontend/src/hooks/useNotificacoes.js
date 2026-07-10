import { useEffect, useState } from 'react'
import { solicitacoesApi, jogosApi, timesApi } from '../api'
import useAuth from '../store/authStore'

export default function useNotificacoes() {
  const { usuario } = useAuth()
  const [notificacoes, setNotificacoes] = useState({
    timesSolicitacoes: 0,
    jogosPendentes: 0,
  })
  const [carregando, setCarregando] = useState(true)

  const carregarNotificacoes = async () => {
    if (!usuario?.id) {
      setCarregando(false)
      return
    }

    try {
      setCarregando(true)
      
      // Busca todos os times do dono
      const { data: times } = await timesApi.meus()
      
      // Busca solicitações pendentes para cada time
      let totalSolicitacoes = 0
      if (times.length > 0) {
        const resultados = await Promise.allSettled(
          times.map((t) =>
            solicitacoesApi.pendentes(t.id).catch(() => ({ data: [] }))
          )
        )
        resultados.forEach((r) => {
          if (r.status === 'fulfilled' && r.value?.data) {
            totalSolicitacoes += r.value.data.length
          }
        })
      }

      // Busca jogos pendentes (que precisam de resposta do dono)
      const { data: jogos } = await jogosApi.meus()
      const jogosPendentes = jogos.filter(
        (j) => j.status === 'PENDENTE' && j.timeDesafiado.usuarioId === usuario.id
      ).length

      setNotificacoes({
        timesSolicitacoes: totalSolicitacoes,
        jogosPendentes,
      })
    } catch (err) {
      console.error('Erro ao carregar notificações:', err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (usuario?.id) {
      carregarNotificacoes()
      // Recarrega a cada 30 segundos
      const intervalo = setInterval(carregarNotificacoes, 30000)
      return () => clearInterval(intervalo)
    }
  }, [usuario?.id])

  return { ...notificacoes, carregando, recarregar: carregarNotificacoes }
}
