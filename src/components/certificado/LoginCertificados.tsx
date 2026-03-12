'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LoginCertificadosProps {
  onSuccess: () => void
}

export default function LoginCertificados({ onSuccess }: LoginCertificadosProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/certificados/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('certificados_admin', 'true')
        onSuccess()
      } else {
        setError('Senha incorreta')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #141414 40%, #1A1A1A 100%)' }}>
      <div className="absolute" style={{ top: '-20%', left: '30%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(200,75,49,0.06) 0%, transparent 55%)', filter: 'blur(60px)' }} />
      <div className="absolute" style={{ bottom: '-15%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(200,75,49,0.04) 0%, transparent 55%)', filter: 'blur(50px)' }} />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl p-8" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
          <div className="flex justify-center mb-6">
            <span className="font-dm text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.15)' }}>
              Certificados
            </span>
          </div>
          <h1 className="font-fraunces text-2xl md:text-3xl text-center mb-2" style={{ color: 'rgba(253,251,247,0.95)' }}>
            Painel Administrativo
          </h1>
          <p className="font-dm text-sm text-center mb-8" style={{ color: 'rgba(253,251,247,0.35)' }}>
            Gestão de certificados e análise de feedback
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.5)' }}>
                Senha de acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha..."
                required
                className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,75,49,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.08)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="font-dm text-sm text-center py-2.5 rounded-xl"
                style={{ color: '#C84B31', backgroundColor: 'rgba(200,75,49,0.08)', border: '1px solid rgba(200,75,49,0.15)' }}>
                {error}
              </motion.p>
            )}
            <button type="submit" disabled={loading}
              className="font-dm w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: loading ? 'rgba(253,251,247,0.1)' : '#C84B31',
                color: loading ? 'rgba(253,251,247,0.3)' : '#fff',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(200,75,49,0.25)',
              }}>
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
