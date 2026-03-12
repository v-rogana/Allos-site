'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import FormCertificado from '@/components/certificado/FormCertificado'

export default function CertificadoPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <FormCertificado />
      </main>
      <Footer />
    </>
  )
}
