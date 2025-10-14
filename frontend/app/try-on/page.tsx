'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { 
  CameraIcon, 
  PhotoIcon, 
  CubeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  CameraIcon as CameraSolidIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Frame {
  id: string
  name: string
  brand: string
  color: string
  price: number
  modelUrl: string
  imageUrl: string
}

// 3D Model Viewer Component
function ModelViewer({ modelUrl, position = [0, 0, 0], scale = 1 }: { 
  modelUrl: string
  position?: [number, number, number]
  scale?: number 
}) {
  const { scene } = useGLTF(modelUrl)
  
  return (
    <primitive object={scene} scale={scale} position={position} />
  )
}

// 3D Scene Component
function Scene3D({ modelUrl, isPreview = false }: { modelUrl: string, isPreview?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="studio" />
      <ModelViewer modelUrl={modelUrl} />
      {!isPreview && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
    </Canvas>
  )
}

export default function VirtualTryOn() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Simulate API call to get frames
    setTimeout(() => {
      setFrames([
        {
          id: '1',
          name: 'Classic Black',
          brand: 'Ray-Ban',
          color: 'Black',
          price: 150,
          modelUrl: '/models/classic-black.glb',
          imageUrl: '/images/frames/classic-black-front.jpg'
        },
        {
          id: '2',
          name: 'Aviator Gold',
          brand: 'Ray-Ban',
          color: 'Gold',
          price: 180,
          modelUrl: '/models/aviator-gold.glb',
          imageUrl: '/images/frames/aviator-gold-front.jpg'
        },
        {
          id: '3',
          name: 'Modern Blue',
          brand: 'Oakley',
          color: 'Blue',
          price: 200,
          modelUrl: '/models/modern-blue.glb',
          imageUrl: '/images/frames/modern-blue-front.jpg'
        },
        {
          id: '4',
          name: 'Elegant Silver',
          brand: 'Gucci',
          color: 'Silver',
          price: 350,
          modelUrl: '/models/elegant-silver.glb',
          imageUrl: '/images/frames/elegant-silver-front.jpg'
        }
      ])
      setSelectedFrame({
        id: '1',
        name: 'Classic Black',
        brand: 'Ray-Ban',
        color: 'Black',
        price: 150,
        modelUrl: '/models/classic-black.glb',
        imageUrl: '/images/frames/classic-black-front.jpg'
      })
      setLoading(false)
    }, 1000)
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        toast.success('Camera activated')
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Unable to access camera')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setIsRecording(false)
    toast.success('Camera deactivated')
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/png')
        setCapturedImage(imageData)
        toast.success('Photo captured!')
      }
    }
  }

  const uploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
        toast.success('Photo uploaded!')
      }
      reader.readAsDataURL(file)
    }
  }

  const selectFrame = (frame: Frame) => {
    setSelectedFrame(frame)
    toast.success(`Selected ${frame.name}`)
  }

  const nextFrame = () => {
    if (selectedFrame) {
      const currentIndex = frames.findIndex(f => f.id === selectedFrame.id)
      const nextIndex = (currentIndex + 1) % frames.length
      setSelectedFrame(frames[nextIndex])
    }
  }

  const prevFrame = () => {
    if (selectedFrame) {
      const currentIndex = frames.findIndex(f => f.id === selectedFrame.id)
      const prevIndex = currentIndex === 0 ? frames.length - 1 : currentIndex - 1
      setSelectedFrame(frames[prevIndex])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Virtual Try-On</h1>
              <p className="text-sm text-gray-500">Try on frames virtually with your camera or upload a photo</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCameraActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isCameraActive ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Start Camera
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera/Photo Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">Start Your Virtual Try-On</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Activate your camera or upload a photo to begin
                      </p>
                      <label className="btn-primary cursor-pointer">
                        <PhotoIcon className="h-4 w-4 mr-2" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadPhoto}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Overlay for frame preview */}
                {selectedFrame && (isCameraActive || capturedImage) && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-16 border-2 border-primary-500 rounded-lg opacity-50">
                        {/* Frame overlay would be positioned here */}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Capture button */}
                {isCameraActive && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={capturePhoto}
                      className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <CameraSolidIcon className="h-6 w-6 text-gray-900" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="mt-4 flex justify-center space-x-4">
                {!isCameraActive && !capturedImage && (
                  <button
                    onClick={startCamera}
                    className="btn-primary inline-flex items-center"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Start Camera
                  </button>
                )}
                
                {!isCameraActive && !capturedImage && (
                  <label className="btn-secondary cursor-pointer">
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadPhoto}
                      className="hidden"
                    />
                  </label>
                )}
                
                {(isCameraActive || capturedImage) && (
                  <button
                    onClick={() => {
                      setCapturedImage(null)
                      stopCamera()
                    }}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Frame Selection */}
          <div className="space-y-6">
            {/* Selected Frame Info */}
            {selectedFrame && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Frame</h3>
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {selectedFrame.modelUrl ? (
                      <Scene3D modelUrl={selectedFrame.modelUrl} isPreview={true} />
                    ) : (
                      <img
                        src={selectedFrame.imageUrl}
                        alt={selectedFrame.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedFrame.name}</h4>
                    <p className="text-sm text-gray-600">{selectedFrame.brand} • {selectedFrame.color}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">${selectedFrame.price}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary">
                      Add to Cart
                    </button>
                    <button className="btn-secondary">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Frame Gallery */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Choose Frame</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={prevFrame}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextFrame}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => selectFrame(frame)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedFrame?.id === frame.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                      {frame.modelUrl ? (
                        <Scene3D modelUrl={frame.modelUrl} isPreview={true} />
                      ) : (
                        <img
                          src={frame.imageUrl}
                          alt={frame.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">{frame.name}</p>
                      <p className="text-xs text-gray-500">{frame.brand}</p>
                      <p className="text-xs font-semibold text-gray-900">${frame.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}