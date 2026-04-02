import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Lexis Agency ERP — Σύστημα Διαχείρισης Πελατών',
  title: 'Lexis Agency MyPortal',
  icons: {
    icon: '/favicon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  )
}
