'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { 
  CubeIcon, 
  EyeIcon, 
  DownloadIcon, 
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Model3D {
  id: string
  frameId: string
  frameName: string
  frameBrand: string
  frameColor: string
  modelUrl: string
  status: 'generating' | 'ready' | 'error'
  fileSize: number
  vertices: number
  faces: number
  createdAt: string
  lastUsed: string | null
  tryOnCount: number
}

// 3D Model Viewer Component
function ModelViewer({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)
  
  return (
    <primitive object={scene} scale={1} position={[0, 0, 0]} />
  )
}

// 3D Scene Component
function Scene3D({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="studio" />
      <ModelViewer modelUrl={modelUrl} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  )
}

export default function Models3D() {
  const [models, setModels] = useState<Model3D[]>([])
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setModels([
        {
          id: '1',
          frameId: '1',
          frameName: 'Classic Black',
          frameBrand: 'Ray-Ban',
          frameColor: 'Black',
          modelUrl: '/models/classic-black.glb',
          status: 'ready',
          fileSize: 2.4,
          vertices: 15420,
          faces: 10280,
          createdAt: '2024-01-15',
          lastUsed: '2024-01-16',
          tryOnCount: 89
        },
        {
          id: '2',
          frameId: '2',
          frameName: 'Aviator Gold',
          frameBrand: 'Ray-Ban',
          frameColor: 'Gold',
          modelUrl: '/models/aviator-gold.glb',
          status: 'ready',
          fileSize: 3.1,
          vertices: 18950,
          faces: 12630,
          createdAt: '2024-01-14',
          lastUsed: '2024-01-16',
          tryOnCount: 67
        },
        {
          id: '3',
          frameId: '3',
          frameName: 'Modern Blue',
          frameBrand: 'Oakley',
          frameColor: 'Blue',
          modelUrl: '/models/modern-blue.glb',
          status: 'generating',
          fileSize: 0,
          vertices: 0,
          faces: 0,
          createdAt: '2024-01-16',
          lastUsed: null,
          tryOnCount: 0
        },
        {
          id: '4',
          frameId: '4',
          frameName: 'Vintage Brown',
          frameBrand: 'Persol',
          frameColor: 'Brown',
          modelUrl: '',
          status: 'error',
          fileSize: 0,
          vertices: 0,
          faces: 0,
          createdAt: '2024-01-16',
          lastUsed: null,
          tryOnCount: 0
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const regenerateModel = async (modelId: string) => {
    setIsGenerating(true)
    toast.loading('Regenerating 3D model...', { id: 'regenerating' })
    
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'generating' as const }
        : model
    ))
    
    // Simulate regeneration process
    setTimeout(() => {
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              status: 'ready' as const,
              fileSize: Math.random() * 3 + 1,
              vertices: Math.floor(Math.random() * 20000) + 10000,
              faces: Math.floor(Math.random() * 15000) + 8000,
              lastUsed: new Date().toISOString().split('T')[0]
            }
          : model
      ))
      setIsGenerating(false)
      toast.success('3D model regenerated successfully!', { id: 'regenerating' })
    }, 8000)
  }

  const deleteModel = (modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId))
    if (selectedModel?.id === modelId) {
      setSelectedModel(null)
    }
    toast.success('3D model deleted successfully')
  }

  const downloadModel = (model: Model3D) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = model.modelUrl
    link.download = `${model.frameName.toLowerCase().replace(/\s+/g, '-')}.glb`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Model download started')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready'
      case 'generating': return 'Generating'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'generating': return <ArrowPathIcon className="h-5 w-5 text-yellow-500 animate-spin" />
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            3D Models
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and preview 3D models for virtual try-on
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Models List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Models</h3>
            <div className="space-y-3">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedModel?.id === model.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{model.frameName}</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(model.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                        {getStatusText(model.status)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{model.frameBrand} • {model.frameColor}</p>
                  
                  {model.status === 'ready' && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Size: {model.fileSize.toFixed(1)} MB</p>
                      <p>Vertices: {model.vertices.toLocaleString()}</p>
                      <p>Faces: {model.faces.toLocaleString()}</p>
                      <p>Try-ons: {model.tryOnCount}</p>
                    </div>
                  )}
                  
                  {model.status === 'generating' && (
                    <div className="text-xs text-yellow-600">
                      <p>Generating 3D model...</p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div className="bg-yellow-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  
                  {model.status === 'error' && (
                    <div className="text-xs text-red-600">
                      <p>Failed to generate model</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">3D Preview</h3>
              {selectedModel && selectedModel.status === 'ready' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadModel(selectedModel)}
                    className="btn-secondary text-sm"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => regenerateModel(selectedModel.id)}
                    disabled={isGenerating}
                    className="btn-primary text-sm"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>
            
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {selectedModel ? (
                selectedModel.status === 'ready' ? (
                  <Scene3D modelUrl={selectedModel.modelUrl} />
                ) : selectedModel.status === 'generating' ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <ArrowPathIcon className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">Generating 3D Model</p>
                      <p className="text-sm text-gray-500">This may take a few minutes...</p>
                    </div>
                  </div>
                ) : selectedModel.status === 'error' ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">Generation Failed</p>
                      <p className="text-sm text-gray-500">Unable to create 3D model</p>
                      <button
                        onClick={() => regenerateModel(selectedModel.id)}
                        className="mt-4 btn-primary"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : null
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">Select a Model</p>
                    <p className="text-sm text-gray-500">Choose a 3D model from the list to preview</p>
                  </div>
                </div>
              )}
            </div>
            
            {selectedModel && selectedModel.status === 'ready' && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p className="font-medium">{selectedModel.fileSize.toFixed(1)} MB</p>
                </div>
                <div>
                  <p className="text-gray-500">Vertices</p>
                  <p className="font-medium">{selectedModel.vertices.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Faces</p>
                  <p className="font-medium">{selectedModel.faces.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Try-ons</p>
                  <p className="font-medium">{selectedModel.tryOnCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Model Details</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complexity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Try-ons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{model.frameName}</div>
                    <div className="text-sm text-gray-500">{model.frameBrand} • {model.frameColor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(model.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                        {getStatusText(model.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.status === 'ready' ? `${model.fileSize.toFixed(1)} MB` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.status === 'ready' ? `${model.vertices.toLocaleString()} vertices` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.tryOnCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {model.status === 'ready' && (
                      <button
                        onClick={() => downloadModel(model)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteModel(model.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}