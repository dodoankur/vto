'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  EyeIcon, 
  CubeIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalTryOns: number
    totalFrames: number
    activeUsers: number
    conversionRate: number
    tryOnsToday: number
    tryOnsThisWeek: number
    tryOnsThisMonth: number
  }
  frameStats: Array<{
    id: string
    name: string
    brand: string
    tryOnCount: number
    conversionRate: number
    revenue: number
    trend: 'up' | 'down' | 'stable'
  }>
  timeSeries: Array<{
    date: string
    tryOns: number
    conversions: number
    revenue: number
  }>
  userEngagement: {
    averageSessionTime: number
    bounceRate: number
    returnUsers: number
    newUsers: number
  }
  deviceStats: {
    desktop: number
    mobile: number
    tablet: number
  }
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        overview: {
          totalTryOns: 1247,
          totalFrames: 24,
          activeUsers: 89,
          conversionRate: 12.5,
          tryOnsToday: 45,
          tryOnsThisWeek: 312,
          tryOnsThisMonth: 1247
        },
        frameStats: [
          {
            id: '1',
            name: 'Classic Black',
            brand: 'Ray-Ban',
            tryOnCount: 89,
            conversionRate: 15.2,
            revenue: 1350,
            trend: 'up'
          },
          {
            id: '2',
            name: 'Aviator Gold',
            brand: 'Ray-Ban',
            tryOnCount: 67,
            conversionRate: 11.9,
            revenue: 1206,
            trend: 'up'
          },
          {
            id: '3',
            name: 'Modern Blue',
            brand: 'Oakley',
            tryOnCount: 54,
            conversionRate: 9.3,
            revenue: 1080,
            trend: 'down'
          },
          {
            id: '4',
            name: 'Elegant Silver',
            brand: 'Gucci',
            tryOnCount: 23,
            conversionRate: 17.4,
            revenue: 805,
            trend: 'stable'
          },
          {
            id: '5',
            name: 'Sport Red',
            brand: 'Oakley',
            tryOnCount: 41,
            conversionRate: 7.3,
            revenue: 656,
            trend: 'down'
          }
        ],
        timeSeries: [
          { date: '2024-01-01', tryOns: 45, conversions: 6, revenue: 180 },
          { date: '2024-01-02', tryOns: 52, conversions: 8, revenue: 240 },
          { date: '2024-01-03', tryOns: 38, conversions: 5, revenue: 150 },
          { date: '2024-01-04', tryOns: 61, conversions: 9, revenue: 270 },
          { date: '2024-01-05', tryOns: 47, conversions: 7, revenue: 210 },
          { date: '2024-01-06', tryOns: 55, conversions: 8, revenue: 240 },
          { date: '2024-01-07', tryOns: 43, conversions: 6, revenue: 180 }
        ],
        userEngagement: {
          averageSessionTime: 3.2,
          bounceRate: 28.5,
          returnUsers: 34,
          newUsers: 55
        },
        deviceStats: {
          desktop: 45,
          mobile: 48,
          tablet: 7
        }
      })
      setLoading(false)
    }, 1000)
  }, [timeRange])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track performance and user engagement with your virtual try-on platform
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="input-field"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Try-Ons</dt>
                <dd className="text-lg font-medium text-gray-900">{data.overview.totalTryOns.toLocaleString()}</dd>
                <dd className="text-sm text-gray-500">+{data.overview.tryOnsToday} today</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Frames</dt>
                <dd className="text-lg font-medium text-gray-900">{data.overview.totalFrames}</dd>
                <dd className="text-sm text-gray-500">Ready for try-on</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                <dd className="text-lg font-medium text-gray-900">{data.overview.conversionRate}%</dd>
                <dd className="text-sm text-gray-500">Try-on to purchase</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUpIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd className="text-lg font-medium text-gray-900">{data.overview.activeUsers}</dd>
                <dd className="text-sm text-gray-500">This month</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Try-Ons Over Time */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Try-Ons Over Time</h3>
          <div className="h-64 flex items-end space-x-2">
            {data.timeSeries.map((day, index) => {
              const maxTryOns = Math.max(...data.timeSeries.map(d => d.tryOns))
              const height = (day.tryOns / maxTryOns) * 200
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${height}px` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs font-medium text-gray-900">{day.tryOns}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Device Usage */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Mobile</span>
              </div>
              <span className="text-sm text-gray-500">{data.deviceStats.mobile}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.deviceStats.mobile}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Desktop</span>
              </div>
              <span className="text-sm text-gray-500">{data.deviceStats.desktop}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.deviceStats.desktop}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Tablet</span>
              </div>
              <span className="text-sm text-gray-500">{data.deviceStats.tablet}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${data.deviceStats.tablet}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Performance */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Frame Performance</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Try-Ons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.frameStats.map((frame) => (
                <tr key={frame.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{frame.name}</div>
                    <div className="text-sm text-gray-500">{frame.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{frame.tryOnCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{frame.conversionRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${frame.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(frame.trend)}
                      <span className={`ml-2 text-sm ${getTrendColor(frame.trend)}`}>
                        {frame.trend === 'up' ? '↗' : frame.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{data.userEngagement.averageSessionTime}m</div>
          <div className="text-sm text-gray-500">Avg Session Time</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{data.userEngagement.bounceRate}%</div>
          <div className="text-sm text-gray-500">Bounce Rate</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{data.userEngagement.returnUsers}</div>
          <div className="text-sm text-gray-500">Return Users</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{data.userEngagement.newUsers}</div>
          <div className="text-sm text-gray-500">New Users</div>
        </div>
      </div>
    </div>
  )
}