'use client'

import { useState, useEffect } from 'react'
import { 
  CubeIcon, 
  PhotoIcon, 
  EyeIcon, 
  ChartBarIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface Frame {
  id: string
  name: string
  brand: string
  color: string
  price: number
  status: 'draft' | 'processing' | 'ready' | 'error'
  tryOnCount: number
  createdAt: string
  modelUrl?: string
}

interface Stats {
  totalFrames: number
  readyFrames: number
  processingFrames: number
  totalTryOns: number
  popularFrames: Frame[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalFrames: 0,
    readyFrames: 0,
    processingFrames: 0,
    totalTryOns: 0,
    popularFrames: []
  })
  const [recentFrames, setRecentFrames] = useState<Frame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalFrames: 24,
        readyFrames: 18,
        processingFrames: 3,
        totalTryOns: 1247,
        popularFrames: [
          { id: '1', name: 'Classic Black', brand: 'Ray-Ban', color: 'Black', price: 150, status: 'ready', tryOnCount: 89, createdAt: '2024-01-15', modelUrl: '/models/classic-black.glb' },
          { id: '2', name: 'Aviator Gold', brand: 'Ray-Ban', color: 'Gold', price: 180, status: 'ready', tryOnCount: 67, createdAt: '2024-01-14', modelUrl: '/models/aviator-gold.glb' },
          { id: '3', name: 'Modern Blue', brand: 'Oakley', color: 'Blue', price: 200, status: 'ready', tryOnCount: 54, createdAt: '2024-01-13', modelUrl: '/models/modern-blue.glb' }
        ]
      })
      setRecentFrames([
        { id: '4', name: 'Vintage Brown', brand: 'Persol', color: 'Brown', price: 220, status: 'processing', tryOnCount: 0, createdAt: '2024-01-16' },
        { id: '5', name: 'Sport Red', brand: 'Oakley', color: 'Red', price: 160, status: 'draft', tryOnCount: 0, createdAt: '2024-01-16' },
        { id: '6', name: 'Elegant Silver', brand: 'Gucci', color: 'Silver', price: 350, status: 'ready', tryOnCount: 23, createdAt: '2024-01-15', modelUrl: '/models/elegant-silver.glb' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Frame
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Frames</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalFrames}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PhotoIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Ready for Try-On</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.readyFrames}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Processing</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.processingFrames}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Try-Ons</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalTryOns.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Frames */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Most Popular Frames</h3>
        <div className="space-y-3">
          {stats.popularFrames.map((frame, index) => (
            <div key={frame.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{frame.name}</p>
                  <p className="text-sm text-gray-500">{frame.brand} • {frame.color}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{frame.tryOnCount} try-ons</p>
                  <p className="text-sm text-gray-500">${frame.price}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(frame.status)}`}>
                  {getStatusText(frame.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Frames */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Frames</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Try-Ons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentFrames.map((frame) => (
                <tr key={frame.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{frame.name}</div>
                    <div className="text-sm text-gray-500">{frame.color}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{frame.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${frame.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(frame.status)}`}>
                      {getStatusText(frame.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{frame.tryOnCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{frame.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}