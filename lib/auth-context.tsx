"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, loginUser, signupUser } from "@/lib/api"

interface User {
  _id: string
  identifier: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  signup: (name: string, identifier: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (identifier: string, password: string) => {
    const data = await loginUser(identifier, password)
    localStorage.setItem("token", data.token)
    setUser(data.user)
  }

  const signup = async (name: string, identifier: string, password: string) => {
    await signupUser(name, identifier, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Update the useAuth function to handle the case when it's used outside the AuthProvider
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Instead of throwing an error, return a default value
    return {
      user: null,
      loading: true,
      login: async () => {},
      signup: async () => {},
      logout: () => {},
    }
  }
  return context
}
