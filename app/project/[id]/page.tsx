"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProjectDetails } from "@/components/project-details"
import { useAuth } from "@/lib/auth-context"
import { getAlertById } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Project } from "@/app/types/project"

export default function ProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchProject = async () => {
      if (user && params.id) {
        try {
          setProjectLoading(true)
          const data = await getAlertById(params.id as string)
          setProject(data)
        } catch (error) {
          console.error("Failed to fetch project:", error)
          // router.push("/")
        } finally {
          setProjectLoading(false)
        }
      }
    }

    if (user && params.id) {
      fetchProject()
    }
  }, [user, params.id, router])

  if (loading || !user || projectLoading) {
    return <LoadingProject />
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-medium mb-2">Project not found</h2>
          <p className="text-muted-foreground">
            The project you are looking for does not exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <ProjectDetails
        project={project}
        onProjectUpdated={(updatedProject) => {
          setProject(updatedProject)
        }}
        onProjectDeleted={() => {
          router.push("/")
        }}
      />
    </div>
  )
}

function LoadingProject() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    </div>
  )
}
