import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { AlertOctagon, ArrowRight, Mail } from "lucide-react"

interface Project {
  _id: string
  projectName: string
  email: string
  count: number
  limit: number
  createdAt: string
  updatedAt: string
}

interface ProjectListProps {
  projects: Project[]
  onProjectsChanged?: () => void
}

export function ProjectList({ projects, onProjectsChanged }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project._id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="truncate">{project.projectName}</CardTitle>
              <Badge variant={project.count >= project.limit ? "destructive" : "outline"}>
                {project.count}/{project.limit}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {project.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertOctagon className="h-4 w-4" />
              {project.count === 0 ? (
                <span>No alerts triggered</span>
              ) : (
                <span>
                  {project.count} {project.count === 1 ? "alert" : "alerts"} triggered
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Created {formatDistanceToNow(new Date(project.createdAt))} ago
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full gap-2">
              <Link href={`/project/${project._id}`}>
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
