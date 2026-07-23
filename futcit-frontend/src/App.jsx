import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './store/authStore'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TimesPublicos from './pages/TimesPublicos'
import TimesDisponiveis from './pages/TimesDisponiveis'
import MeusTimes from './pages/MeusTimes'
import MeusJogos from './pages/MeusJogos'
import TimesParaJogador from './pages/TimesParaJogador'
import MeusPedidos from './pages/MeusPedidos'
import Confrontos from './pages/Confrontos'
import PerfilPage from './pages/PerfilPage'

function Privada({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div style={{ padding:'3rem', textAlign:'center', color:'var(--muted)' }}>Carregando...</div>
  return usuario ? children : <Navigate to="/login" replace />
}

export default function App() {
  const inicializar = useAuth(s => s.inicializar)
  useEffect(() => { inicializar() }, [])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/registrar"  element={<RegisterPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/esqueceu-senha" element={<ForgotPasswordPage />} />
        <Route path="/reset-senha" element={<ResetPasswordPage />} />
        <Route path="/times"      element={<TimesPublicos />} />
        <Route path="/disponiveis" element={<TimesDisponiveis />} />
        <Route path="/confrontos" element={<Confrontos />} />

        {/* Rotas do DONO */}
        <Route path="/meus-times" element={<Privada><MeusTimes /></Privada>} />
        <Route path="/meus-jogos" element={<Privada><MeusJogos /></Privada>} />
        <Route path="/perfil" element={<Privada><PerfilPage /></Privada>} />

        {/* Rotas do JOGADOR */}
        <Route path="/times-jogador"  element={<Privada><TimesParaJogador /></Privada>} />
        <Route path="/meus-pedidos"   element={<Privada><MeusPedidos /></Privada>} />

        <Route path="/" element={<Navigate to="/times" replace />} />
      </Routes>
    </>
  )
}
