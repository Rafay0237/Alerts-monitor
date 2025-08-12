import axios from "axios"


// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API calls
export const loginUser = async (identifier: string, password: string) => {
  const response = await api.post("/auth/login", { identifier, password })
  return response.data
}

export const signupUser = async (name: string, identifier: string, password: string) => {
  const response = await api.post("/auth/signup", { name, identifier, password })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me")
  return response.data
}

// Alerts API calls
export const createAlert = async (projectData: {
  projectName: string
  email: string
  limit: number
}) => {
  const response = await api.post("/alerts/create", projectData)
  return response.data
}

export const getAllAlerts = async (userId: string) => {
  const response = await api.get(`/alerts/get-all/${userId}`)
  return response.data
}

export const getAlertById = async (key: string) => {
  const response = await api.get(`/alerts/${key}`)
  return response.data
}

export const reportCrash = async (key: string) => {
  const response = await api.post(`/alerts/report/${key}`)
  return response.data
}

export const updateAlert = async (id: string, data: { projectName?: string; email?: string; limit?: number }) => {
  const response = await api.put(`/alerts/${id}`, data)
  return response.data
}

export const deleteAlert = async (id: string) => {
  const response = await api.delete(`/alerts/${id}`)
  return response.data
}


export const regenerateAlertKey = async (id: string) => {
  const response = await api.put(`/alerts/${id}/regenerate-key`)
  return response.data
}