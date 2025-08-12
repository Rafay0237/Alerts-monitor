"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createAlert } from "@/lib/api"

interface CreateProjectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  onProjectCreated?: () => void
}

export function CreateProjectButton({ variant = "outline", onProjectCreated }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [email, setEmail] = useState("")
  const [limit, setLimit] = useState("10")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await createAlert({
        projectName,
        email,
        limit: Number.parseInt(limit),
      })

      setOpen(false)

      // Reset form
      setProjectName("")
      setEmail("")
      setLimit("10")

      // Notify parent component
      if (onProjectCreated) {
        onProjectCreated()
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>
              Create a new project to monitor your website and receive alerts when it crashes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Alert Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alerts@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Alert Limit</Label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="1000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">Maximum number of alerts that can be sent per day</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
