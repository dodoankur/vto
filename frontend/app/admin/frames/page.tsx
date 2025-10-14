'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  PlusIcon, 
  PhotoIcon, 
  TrashIcon, 
  EyeIcon,
  PencilIcon,
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Frame {
  id: string
  name: string
  brand: string
  color: string
  price: number
  description: string
  status: 'draft' | 'processing' | 'ready' | 'error'
  tryOnCount: number
  createdAt: string
  modelUrl?: string
  images: {
    front: string | null
    side: string | null
    back: string | null
    top: string | null
    bottom: string | null
    angle: string | null
  }
}

interface FrameFormData {
  name: string
  brand: string
  color: string
  price: number
  description: string
}

const angleLabels = {
  front: 'Front View',
  side: 'Side View', 
  back: 'Back View',
  top: 'Top View',
  bottom: 'Bottom View',
  angle: '45° Angle'
}

export default function FrameManagement() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingFrame, setEditingFrame] = useState<Frame | null>(null)
  const [formData, setFormData] = useState<FrameFormData>({
    name: '',
    brand: '',
    color: '',
    price: 0,
    description: ''
  })
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: File | null}>({
    front: null,
    side: null,
    back: null,
    top: null,
    bottom: null,
    angle: null
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFrames([
        {
          id: '1',
          name: 'Classic Black',
          brand: 'Ray-Ban',
          color: 'Black',
          price: 150,
          description: 'Timeless black frame with classic design',
          status: 'ready',
          tryOnCount: 89,
          createdAt: '2024-01-15',
          modelUrl: '/models/classic-black.glb',
          images: {
            front: '/images/frames/classic-black-front.jpg',
            side: '/images/frames/classic-black-side.jpg',
            back: '/images/frames/classic-black-back.jpg',
            top: '/images/frames/classic-black-top.jpg',
            bottom: '/images/frames/classic-black-bottom.jpg',
            angle: '/images/frames/classic-black-angle.jpg'
          }
        },
        {
          id: '2',
          name: 'Aviator Gold',
          brand: 'Ray-Ban',
          color: 'Gold',
          price: 180,
          description: 'Premium gold aviator sunglasses',
          status: 'ready',
          tryOnCount: 67,
          createdAt: '2024-01-14',
          modelUrl: '/models/aviator-gold.glb',
          images: {
            front: '/images/frames/aviator-gold-front.jpg',
            side: '/images/frames/aviator-gold-side.jpg',
            back: '/images/frames/aviator-gold-back.jpg',
            top: '/images/frames/aviator-gold-top.jpg',
            bottom: '/images/frames/aviator-gold-bottom.jpg',
            angle: '/images/frames/aviator-gold-angle.jpg'
          }
        },
        {
          id: '3',
          name: 'Modern Blue',
          brand: 'Oakley',
          color: 'Blue',
          price: 200,
          description: 'Sporty blue frame with modern design',
          status: 'processing',
          tryOnCount: 0,
          createdAt: '2024-01-16',
          images: {
            front: '/images/frames/modern-blue-front.jpg',
            side: null,
            back: null,
            top: null,
            bottom: null,
            angle: null
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const onDrop = (acceptedFiles: File[], angle: string) => {
    if (acceptedFiles.length > 0) {
      setUploadedImages(prev => ({
        ...prev,
        [angle]: acceptedFiles[0]
      }))
      toast.success(`${angleLabels[angle as keyof typeof angleLabels]} uploaded successfully`)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, 'front'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  })

  const createDropzone = (angle: string) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, angle),
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png']
      },
      multiple: false
    })

    return { getRootProps, getInputProps, isDragActive }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.brand || !formData.color) {
      toast.error('Please fill in all required fields')
      return
    }

    const hasImages = Object.values(uploadedImages).some(img => img !== null)
    if (!hasImages) {
      toast.error('Please upload at least one image')
      return
    }

    setIsGenerating(true)
    
    // Simulate API call
    setTimeout(() => {
      const newFrame: Frame = {
        id: Date.now().toString(),
        ...formData,
        status: 'processing',
        tryOnCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        images: {
          front: uploadedImages.front ? URL.createObjectURL(uploadedImages.front) : null,
          side: uploadedImages.side ? URL.createObjectURL(uploadedImages.side) : null,
          back: uploadedImages.back ? URL.createObjectURL(uploadedImages.back) : null,
          top: uploadedImages.top ? URL.createObjectURL(uploadedImages.top) : null,
          bottom: uploadedImages.bottom ? URL.createObjectURL(uploadedImages.bottom) : null,
          angle: uploadedImages.angle ? URL.createObjectURL(uploadedImages.angle) : null
        }
      }

      setFrames(prev => [newFrame, ...prev])
      setShowModal(false)
      setFormData({ name: '', brand: '', color: '', price: 0, description: '' })
      setUploadedImages({
        front: null,
        side: null,
        back: null,
        top: null,
        bottom: null,
        angle: null
      })
      setIsGenerating(false)
      toast.success('Frame created successfully! 3D model generation started.')
    }, 2000)
  }

  const generate3DModel = async (frameId: string) => {
    setIsGenerating(true)
    toast.loading('Generating 3D model...', { id: 'generating' })
    
    // Simulate 3D model generation
    setTimeout(() => {
      setFrames(prev => prev.map(frame => 
        frame.id === frameId 
          ? { ...frame, status: 'ready', modelUrl: `/models/${frame.name.toLowerCase().replace(/\s+/g, '-')}.glb` }
          : frame
      ))
      setIsGenerating(false)
      toast.success('3D model generated successfully!', { id: 'generating' })
    }, 5000)
  }

  const deleteFrame = (frameId: string) => {
    setFrames(prev => prev.filter(frame => frame.id !== frameId))
    toast.success('Frame deleted successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready'
      case 'processing': return 'Processing'
      case 'draft': return 'Draft'
      case 'error': return 'Error'
      default: return 'Unknown'
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
            Frame Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload frame images and manage your eyewear collection
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Frame
          </button>
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {frames.map((frame) => (
          <div key={frame.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              {frame.images.front ? (
                <img
                  src={frame.images.front}
                  alt={frame.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{frame.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(frame.status)}`}>
                  {getStatusText(frame.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">{frame.brand} • {frame.color}</p>
              <p className="text-sm text-gray-500">{frame.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">${frame.price}</span>
                <span className="text-sm text-gray-500">{frame.tryOnCount} try-ons</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setEditingFrame(frame)}
                className="flex-1 btn-secondary text-sm"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              
              {frame.status === 'processing' && (
                <button
                  onClick={() => generate3DModel(frame.id)}
                  disabled={isGenerating}
                  className="flex-1 btn-primary text-sm"
                >
                  <CubeIcon className="h-4 w-4 mr-1" />
                  Generate 3D
                </button>
              )}
              
              {frame.status === 'ready' && (
                <button className="flex-1 btn-primary text-sm">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </button>
              )}
              
              <button
                onClick={() => deleteFrame(frame.id)}
                className="btn-danger text-sm px-3"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Frame Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Frame</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frame Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field mt-1"
                      placeholder="e.g., Classic Black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand *</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="input-field mt-1"
                      placeholder="e.g., Ray-Ban"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color *</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="input-field mt-1"
                      placeholder="e.g., Black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="input-field mt-1"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field mt-1"
                    rows={3}
                    placeholder="Frame description..."
                  />
                </div>
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Frame Images (6 angles required for 3D model generation)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(angleLabels).map(([angle, label]) => {
                      const dropzone = createDropzone(angle)
                      const hasImage = uploadedImages[angle as keyof typeof uploadedImages] !== null
                      
                      return (
                        <div key={angle} className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600">{label}</label>
                          <div
                            {...dropzone.getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                              dropzone.isDragActive
                                ? 'border-primary-400 bg-primary-50'
                                : hasImage
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input {...dropzone.getInputProps()} />
                            {hasImage ? (
                              <div className="space-y-2">
                                <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto" />
                                <p className="text-xs text-green-600">Uploaded</p>
                                <p className="text-xs text-gray-500">
                                  {uploadedImages[angle as keyof typeof uploadedImages]?.name}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                <p className="text-xs text-gray-600">
                                  {dropzone.isDragActive ? 'Drop here' : 'Click or drag'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? 'Creating...' : 'Create Frame'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}