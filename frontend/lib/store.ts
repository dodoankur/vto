import { create } from 'zustand'

interface Frame {
  id: string
  name: string
  brand: string
  price: number
  category: string
  image_url: string
  model_url?: string
  rating?: number
  colors?: string[]
}

interface TryOnState {
  selectedFrame: Frame | null
  uploadedImage: string | null
  processedImage: string | null
  isProcessing: boolean
  frames: Frame[]
  
  // Actions
  setSelectedFrame: (frame: Frame | null) => void
  setUploadedImage: (image: string | null) => void
  setProcessedImage: (image: string | null) => void
  setProcessing: (processing: boolean) => void
  setFrames: (frames: Frame[]) => void
  resetTryOn: () => void
}

export const useTryOnStore = create<TryOnState>((set) => ({
  selectedFrame: null,
  uploadedImage: null,
  processedImage: null,
  isProcessing: false,
  frames: [],
  
  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
  setUploadedImage: (image) => set({ uploadedImage: image }),
  setProcessedImage: (image) => set({ processedImage: image }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setFrames: (frames) => set({ frames }),
  resetTryOn: () => set({
    uploadedImage: null,
    processedImage: null,
    isProcessing: false
  })
}))