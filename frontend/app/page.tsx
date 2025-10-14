"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Sparkles, Users, Zap } from "lucide-react";
import TryOnInterface from "@/components/TryOnInterface";
import FrameGallery from "@/components/FrameGallery";
import Header from "@/components/Header";

export default function Home() {
    const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
    const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

    return (
        <div className="min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Try On Eyewear <span className="text-primary-600">Virtually</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Experience the future of eyewear shopping with our AI-powered virtual try-on technology. Upload a selfie or use your webcam for real-time
                        augmented reality preview.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <motion.div whileHover={{ scale: 1.05 }} className="card text-center">
                            <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Upload Selfie</h3>
                            <p className="text-gray-600">Upload a photo and see yourself wearing different frames instantly</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} className="card text-center">
                            <Camera className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Live Try-On</h3>
                            <p className="text-gray-600">Use your webcam for real-time augmented reality try-on experience</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} className="card text-center">
                            <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                            <p className="text-gray-600">Advanced computer vision ensures perfect frame alignment and fit</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Try-On Interface */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
                    <TryOnInterface activeTab={activeTab} setActiveTab={setActiveTab} selectedFrame={selectedFrame} setSelectedFrame={setSelectedFrame} />
                </motion.div>

                {/* Frame Gallery */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                    <FrameGallery selectedFrame={selectedFrame} setSelectedFrame={setSelectedFrame} />
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16 bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                            <div className="text-gray-600">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                            <div className="text-gray-600">Frame Styles</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary-600 mb-2">99%</div>
                            <div className="text-gray-600">Accuracy Rate</div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
