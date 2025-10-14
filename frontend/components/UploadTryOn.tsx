"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, X, Download, RotateCcw } from "lucide-react";
import Image from "next/image";

interface UploadTryOnProps {
    selectedFrame: string | null;
}

export default function UploadTryOn({ selectedFrame }: UploadTryOnProps) {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
                setProcessedImage(null);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        multiple: false,
    });

    const handleTryOn = async () => {
        if (!uploadedImage || !selectedFrame) return;

        setIsProcessing(true);
        try {
            // Convert base64 to File object
            const response = await fetch(uploadedImage);
            const blob = await response.blob();
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

            // Call the backend API
            const { apiClient } = await import("../lib/api");
            const result = await apiClient.processImage(file, selectedFrame);

            if (result.success && result.processed_image) {
                setProcessedImage(result.processed_image);
            } else {
                console.error("Failed to process image:", result);
                alert("Failed to process image. Please try again.");
            }
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Error processing image. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const resetUpload = () => {
        setUploadedImage(null);
        setProcessedImage(null);
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            {!uploadedImage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{isDragActive ? "Drop your selfie here" : "Upload a selfie"}</h3>
                    <p className="text-gray-600 mb-4">Drag and drop an image, or click to select</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, and WebP formats</p>
                </motion.div>
            )}

            {/* Image Preview and Processing */}
            {uploadedImage && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Your Selfie</h3>
                        <button onClick={resetUpload} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">Original</h4>
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <Image src={uploadedImage} alt="Uploaded selfie" fill className="object-cover" />
                            </div>
                        </div>

                        {/* Processed Image */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">With Frame</h4>
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                {processedImage ? (
                                    <Image src={processedImage} alt="Processed with frame" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        {isProcessing ? (
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                                                <p>Processing...</p>
                                            </div>
                                        ) : (
                                            <p>Frame will appear here</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleTryOn}
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

                        {processedImage && (
                            <button className="btn-secondary flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Tips for best results:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use a well-lit, front-facing selfie</li>
                    <li>• Make sure your face is clearly visible</li>
                    <li>• Avoid wearing other eyewear in the photo</li>
                    <li>• Keep a neutral expression for best alignment</li>
                </ul>
            </div>
        </div>
    );
}
