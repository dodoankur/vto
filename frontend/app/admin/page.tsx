'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, BarChart3, Settings, Eye } from 'lucide-react'
import FrameManagement from '@/components/admin/FrameManagement'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import UploadFrame from '@/components/admin/UploadFrame'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'frames' | 'upload' | 'analytics'>('frames')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                Virtual Try-On
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('frames')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'frames'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Frame Management</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Frame</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'frames' && <FrameManagement />}
          {activeTab === 'upload' && <UploadFrame />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </motion.div>
      </div>
    </div>
  )
}