"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X } from "lucide-react";
import UploadTryOn from "./UploadTryOn";
import CameraTryOn from "./CameraTryOn";

interface TryOnInterfaceProps {
    activeTab: "upload" | "camera";
    setActiveTab: (tab: "upload" | "camera") => void;
    selectedFrame: string | null;
    setSelectedFrame: (frameId: string | null) => void;
}

export default function TryOnInterface({ activeTab, setActiveTab, selectedFrame, setSelectedFrame }: TryOnInterfaceProps) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="card">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                            activeTab === "upload" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Upload className="w-5 h-5" />
                        <span className="font-medium">Upload Selfie</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("camera")}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                            activeTab === "camera" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">Live Camera</span>
                    </button>
                </div>

                {/* Selected Frame Display */}
                {selectedFrame && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <span className="text-primary-600 font-semibold">🕶️</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Selected Frame</h3>
                                    <p className="text-sm text-gray-600">Ready for try-on</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFrame(null)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Try-On Content */}
                <div className="min-h-[600px]">
                    {activeTab === "upload" ? <UploadTryOn selectedFrame={selectedFrame} /> : <CameraTryOn selectedFrame={selectedFrame} />}
                </div>
            </div>
        </div>
    );
}
