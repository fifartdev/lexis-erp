import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Lexis Agency ERP — Σύστημα Διαχείρισης Πελατών',
  title: 'Lexis Agency ERP',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  )
}
