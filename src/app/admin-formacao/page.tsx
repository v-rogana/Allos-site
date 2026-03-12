'use client'

import { useState, useEffect } from 'react'
import LoginCertificados from '@/components/certificado/LoginCertificados'
import AdminCertificados from '@/components/certificado/AdminCertificados'

export default function AdminFormacaoPage() {
  const [auth, setAuth] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setAuth(sessionStorage.getItem('certificados_admin') === 'true')
    setChecking(false)
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(200,75,49,0.3)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!auth) {
    return <LoginCertificados onSuccess={() => setAuth(true)} />
  }

  return <AdminCertificados />
}
