"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { signup, loading } = useAuth()

  const [name, setName] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // If auth is still loading, show a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signup(name, identifier, password)
      router.push("/auth/login?registered=true")
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up to start monitoring your websites</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
             {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
