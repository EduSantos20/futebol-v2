import { create } from 'zustand'
import { authApi } from '../api'

const useAuth = create((set) => ({
  usuario: null,
  carregando: true,
  inicializar: async () => {
    const token = localStorage.getItem('token')
    if (!token) { set({ carregando: false }); return }
    try {
      const { data } = await authApi.me()
      set({ usuario: data, carregando: false })
    } catch {
      localStorage.removeItem('token')
      set({ carregando: false })
    }
  },
  login: (token, usuario) => { localStorage.setItem('token', token); set({ usuario }) },
  logout: () => { localStorage.removeItem('token'); set({ usuario: null }) },
}))

export default useAuth
