import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Website Monitor",
  description: "Monitor your websites and get alerts when they crash",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" richColors /> 
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
