'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { apiClient, Frame } from '@/lib/api'

export default function FrameManagement() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadFrames()
  }, [])

  const loadFrames = async () => {
    try {
      setLoading(true)
      const framesData = await apiClient.getFrames()
      setFrames(framesData)
    } catch (error) {
      console.error('Error loading frames:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFrames = frames.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frame.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', name: 'All Frames' },
    { id: 'sunglasses', name: 'Sunglasses' },
    { id: 'prescription', name: 'Prescription' },
    { id: 'sports', name: 'Sports' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Frame Management</h2>
          <p className="text-gray-600">Manage your eyewear frame collection</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Frame</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search frames..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrames.map((frame, index) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow"
          >
            {/* Frame Image */}
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-4xl">🕶️</span>
              </div>
              
              {/* Action Menu */}
              <div className="absolute top-2 right-2">
                <div className="relative group">
                  <button className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Edit className="w-4 h-4" />
                      <span>Edit Frame</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Frame</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  {frame.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">{frame.brand}</p>
              <p className="text-lg font-bold text-primary-600">${frame.price}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 btn-secondary text-sm">
                Edit
              </button>
              <button className="flex-1 btn-primary text-sm">
                Preview
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFrames.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No frames found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by uploading your first frame'
            }
          </p>
          <button className="btn-primary">
            Upload Frame
          </button>
        </div>
      )}
    </div>
  )
}
