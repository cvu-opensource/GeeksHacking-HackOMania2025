import type React from "react"
import { UserProvider } from "./contexts/UserContext"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
