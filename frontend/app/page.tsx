import Link from 'next/link'
import { ArrowRightIcon, CubeIcon, PhotoIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Virtual Try-On Admin
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage frames, generate 3D models, and monitor virtual try-on analytics
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link href="/admin" className="group">
            <div className="card hover:shadow-lg transition-shadow duration-200 group-hover:scale-105 transform">
              <CubeIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frame Management</h3>
              <p className="text-gray-600 mb-4">
                Upload frame images, create 3D models, and manage your eyewear collection
              </p>
              <div className="flex items-center text-primary-600 group-hover:text-primary-700">
                <span className="font-medium">Go to Admin</span>
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </div>
            </div>
          </Link>
          
          <div className="card">
            <PhotoIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">3D Model Generation</h3>
            <p className="text-gray-600 mb-4">
              Automatically generate 3D models from multiple angle images using AI
            </p>
            <div className="flex items-center text-gray-400">
              <span className="font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="card">
            <ChartBarIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Track frame popularity, try-on rates, and user engagement metrics
            </p>
            <div className="flex items-center text-gray-400">
              <span className="font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}