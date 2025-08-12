

export interface Project {
  _id: string
  projectName: string
  email: string
  count: number
  key: string
  limit: number
  createdAt: string
  updatedAt: string
}

export interface ProjectDetailsProps {
  project: Project
  onProjectUpdated?: (project: Project) => void
  onProjectDeleted?: () => void
}