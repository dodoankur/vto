import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Frame {
  id: string
  name: string
  brand: string
  price: number
  category: string
  image_url: string
  model_url?: string
}

export interface ProcessImageResponse {
  success: boolean
  processed_image?: string
  face_detected: boolean
  frame_position?: {
    center_x: number
    center_y: number
    width: number
    height: number
  }
  landmarks?: {
    left_eye: number[][]
    right_eye: number[][]
  }
}

export interface ProcessCameraResponse {
  success: boolean
  face_detected: boolean
  frame_position?: {
    center_x: number
    center_y: number
    width: number
    height: number
  }
  landmarks?: {
    left_eye: number[][]
    right_eye: number[][]
  }
}

export const apiClient = {
  // Get available frames
  getFrames: async (): Promise<Frame[]> => {
    const response = await api.get('/api/frames')
    return response.data.frames
  },

  // Process uploaded image
  processImage: async (
    file: File,
    frameId?: string
  ): Promise<ProcessImageResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    if (frameId) {
      formData.append('frame_id', frameId)
    }

    const response = await api.post('/api/process-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Process camera frame
  processCameraFrame: async (
    imageData: string,
    frameId?: string
  ): Promise<ProcessCameraResponse> => {
    const response = await api.post('/api/process-camera', {
      image_data: imageData,
      frame_id: frameId,
    })
    return response.data
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health')
    return response.data
  },
}

export default api