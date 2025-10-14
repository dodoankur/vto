'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface FrameImage {
  file: File
  preview: string
  angle: string
}

const FRAME_ANGLES = [
  { id: 'front', name: 'Front View', required: true },
  { id: 'side_left', name: 'Left Side', required: true },
  { id: 'side_right', name: 'Right Side', required: true },
  { id: 'back', name: 'Back View', required: true },
  { id: 'top', name: 'Top View', required: false },
  { id: 'detail', name: 'Detail Shot', required: false }
]

export default function UploadFrame() {
  const [frameImages, setFrameImages] = useState<FrameImage[]>([])
  const [frameData, setFrameData] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'sunglasses',
    description: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[], angle: string) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const newImage: FrameImage = {
          file,
          preview: reader.result as string,
          angle
        }
        setFrameImages(prev => {
          const filtered = prev.filter(img => img.angle !== angle)
          return [...filtered, newImage]
        })
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeImage = (angle: string) => {
    setFrameImages(prev => prev.filter(img => img.angle !== angle))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredAngles = FRAME_ANGLES.filter(angle => angle.required)
    const missingAngles = requiredAngles.filter(angle => 
      !frameImages.some(img => img.angle === angle.id)
    )
    
    if (missingAngles.length > 0) {
      alert(`Please upload images for: ${missingAngles.map(a => a.name).join(', ')}`)
      return
    }

    if (!frameData.name || !frameData.brand || !frameData.price) {
      alert('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // In a real implementation, this would upload to the backend
      console.log('Frame data:', frameData)
      console.log('Images:', frameImages)
      
      // Reset form
      setFrameData({
        name: '',
        brand: '',
        price: '',
        category: 'sunglasses',
        description: ''
      })
      setFrameImages([])
      setUploadProgress(0)
      
      alert('Frame uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upload New Frame</h2>
        <p className="text-gray-600">Upload frame images and details to add to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Frame Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frame Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frame Name *
              </label>
              <input
                type="text"
                value={frameData.name}
                onChange={(e) => setFrameData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="e.g., Classic Black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={frameData.brand}
                onChange={(e) => setFrameData(prev => ({ ...prev, brand: e.target.value }))}
                className="input-field"
                placeholder="e.g., Ray-Ban"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                value={frameData.price}
                onChange={(e) => setFrameData(prev => ({ ...prev, price: e.target.value }))}
                className="input-field"
                placeholder="159"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={frameData.category}
                onChange={(e) => setFrameData(prev => ({ ...prev, category: e.target.value }))}
                className="input-field"
                required
              >
                <option value="sunglasses">Sunglasses</option>
                <option value="prescription">Prescription</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={frameData.description}
                onChange={(e) => setFrameData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Describe the frame features, materials, etc."
              />
            </div>
          </div>
        </div>

        {/* Frame Images */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frame Images</h3>
          <p className="text-sm text-gray-600 mb-6">
            Upload high-quality images from different angles. Required angles are marked with *
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FRAME_ANGLES.map(angle => {
              const image = frameImages.find(img => img.angle === angle.id)
              
              return (
                <div key={angle.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {angle.name} {angle.required && '*'}
                  </label>
                  
                  {image ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.preview}
                        alt={angle.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(angle.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadZone
                      onDrop={(files) => onDrop(files, angle.id)}
                      angle={angle}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm font-medium text-gray-700">Uploading frame...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn-secondary"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Frame'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ImageUploadZone({ onDrop, angle }: { onDrop: (files: File[]) => void; angle: any }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`aspect-square border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">
        {isDragActive ? 'Drop image here' : 'Click to upload'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        JPG, PNG, WebP
      </p>
    </div>
  )
}
