"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectList } from "@/components/project-list"
import { CreateProjectButton } from "@/components/create-project-button"
import { useAuth } from "@/lib/auth-context"
import { getAllAlerts } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          setProjectsLoading(true)
          const data = await getAllAlerts(user._id)
          setProjects(data)
        } catch (error) {
          console.error("Failed to fetch projects:", error)
        } finally {
          setProjectsLoading(false)
        }
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  if (loading || !user) {
    return <LoadingDashboard />
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <CreateProjectButton
          onProjectCreated={() => {
            getAllAlerts(user._id).then((data) => setProjects(data))
          }}
        />
      </div>

      {projectsLoading ? (
        <LoadingProjects />
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">Create your first project to start monitoring your website</p>
          <CreateProjectButton
            variant="default"
            onProjectCreated={() => {
              getAllAlerts(user._id).then((data) => setProjects(data))
            }}
          />
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onProjectsChanged={() => {
            getAllAlerts(user._id).then((data) => setProjects(data))
          }}
        />
      )}
    </div>
  )
}

function LoadingDashboard() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <LoadingProjects />
    </div>
  )
}

function LoadingProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}
