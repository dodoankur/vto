'use client'

import { motion } from 'framer-motion'
import { Sparkles, User, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Virtual Try-On</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#try-on" className="text-gray-600 hover:text-primary-600 transition-colors">
              Try On
            </a>
            <a href="#frames" className="text-gray-600 hover:text-primary-600 transition-colors">
              Frames
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
