'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Square, Download, RotateCcw } from 'lucide-react'
import Webcam from 'react-webcam'

interface CameraTryOnProps {
  selectedFrame: string | null
}

export default function CameraTryOn({ selectedFrame }: CameraTryOnProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  const startCamera = () => {
    setIsStreaming(true)
    setCapturedImage(null)
  }

  const stopCamera = () => {
    setIsStreaming(false)
  }

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setCapturedImage(imageSrc)
        setIsStreaming(false)
      }
    }
  }, [webcamRef])

  const resetCapture = () => {
    setCapturedImage(null)
    setIsStreaming(false)
  }

  const processImage = async () => {
    if (!capturedImage || !selectedFrame) return
    
    setIsProcessing(true)
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      // In a real implementation, this would call the backend API
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Camera Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isStreaming && !capturedImage && (
          <button
            onClick={startCamera}
            className="btn-primary flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Start Camera</span>
          </button>
        )}

        {isStreaming && (
          <button
            onClick={capturePhoto}
            className="btn-primary flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <Square className="w-4 h-4" />
            <span>Capture Photo</span>
          </button>
        )}

        {capturedImage && (
          <div className="flex space-x-2">
            <button
              onClick={processImage}
              disabled={!selectedFrame || isProcessing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Try On Frame</span>
                </>
              )}
            </button>
            <button
              onClick={resetCapture}
              className="btn-secondary flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>

      {/* Camera Feed or Captured Image */}
      <div className="relative">
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              width="100%"
              height="100%"
              className="object-cover"
              screenshotFormat="image/jpeg"
            />
            
            {/* Frame Overlay (simulated) */}
            {selectedFrame && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-16 border-4 border-primary-500 rounded-lg opacity-50 animate-pulse">
                  <div className="w-full h-full border-2 border-white rounded-lg"></div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {capturedImage && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
              
              {/* Frame Overlay for captured image */}
              {selectedFrame && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-16 border-4 border-primary-500 rounded-lg">
                    <div className="w-full h-full border-2 border-white rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Photo</span>
              </button>
            </div>
          </motion.div>
        )}

        {!isStreaming && !capturedImage && (
          <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Camera Ready</p>
              <p className="text-sm">Click "Start Camera" to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Live Try-On Tips:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Ensure good lighting for best face detection</li>
          <li>• Look directly at the camera</li>
          <li>• Keep your face centered in the frame</li>
          <li>• The frame will appear as an overlay on your face</li>
        </ul>
      </div>
    </div>
  )
}