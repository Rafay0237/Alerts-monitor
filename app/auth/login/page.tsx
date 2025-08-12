"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { login, loading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    );
  }

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(identifier, password);
      router.push("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the form fields
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            {registered && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-800" />
                <AlertDescription>
                  Account created successfully! You can now log in.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
