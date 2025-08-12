"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogOut, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const isAuthenticated = !!user

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          <span>WebMonitor</span>
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-9 w-24" />
          ) : isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                    {user.identifier || "Account"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            pathname !== "/auth/login" &&
            pathname !== "/auth/signup" && (
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            )
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
