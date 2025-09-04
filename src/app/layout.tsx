import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Mapa Ambiental',
  description: 'Visualización de datos ambientales en mapas interactivos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <div className="fixed bottom-0 left-0 right-0 bg-warning-100 border-t border-warning-300 p-2 text-center text-sm text-warning-800 z-50">
          ⚠️ Los datos podrán ser borrados si el administrador lo considera
        </div>
      </body>
    </html>
  )
}
