import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  cfg.headers['ngrok-skip-browser-warning'] = 'true'
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/login' }
    return Promise.reject(err)
  }
)

export const authApi = {
  registrar:      d => api.post('/auth/registrar', d),
  login:          d => api.post('/auth/login', d),
  me:             () => api.get('/auth/me'),
  forgotPassword: d => api.post('/auth/forgot-password', d),
  resetPassword:  d => api.post('/auth/reset-password', d),
}

export const timesApi = {
  publicos:    ()       => api.get('/times/publicos'),
  disponiveis: ()       => api.get('/times/disponiveis'),
  meus:        ()       => api.get('/times/meus'),
  criar:       d        => api.post('/times/registrar', d),
  atualizar:   (id, d)  => api.put(`/times/${id}`, d),
  deletar:     id       => api.delete(`/times/${id}`),
  disponib:    id       => api.patch(`/times/${id}/disponibilidade`),
  escudo:      (id, f)  => api.post(`/times/${id}/escudo`, f, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const jogosApi = {
  desafiar:  d         => api.post('/jogos/desafiar', d),
  responder: (id, d)   => api.patch(`/jogos/${id}/responder`, d),
  cancelar:  (id, d)   => api.patch(`/jogos/${id}/cancelar`, d),
  meus:      ()        => api.get('/jogos/meus'),
  pendentes: ()        => api.get('/jogos/pendentes'),
  registrarPlacar: (id, d) => api.patch(`/jogos/${id}/registrar-placar`, d),
}

export const confrontosApi = {
  listar: (data) => api.get('/jogos/confrontos', { params: { data } }),
  
}


export const solicitacoesApi = {
  entrar:    (timeId, d) => api.post(`/times/${timeId}/solicitar-entrada`, d || {}),
  sair:      (timeId, d) => api.post(`/times/${timeId}/solicitar-saida`, d || {}),
  responder: (id, d)     => api.patch(`/solicitacoes/${id}/responder`, d),
  pendentes: timeId      => api.get(`/times/${timeId}/solicitacoes`),
  minhas:    ()          => api.get('/solicitacoes/minhas'),
  membros:   timeId      => api.get(`/times/${timeId}/membros`),
  remover:   (timeId, usuarioId) => api.delete(`/times/${timeId}/membros/${usuarioId}`),
}

export default api
