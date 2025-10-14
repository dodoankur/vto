"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, ShoppingCart } from "lucide-react";
import { apiClient, Frame } from "../lib/api";

interface FrameGalleryProps {
    selectedFrame: string | null;
    setSelectedFrame: (frameId: string | null) => void;
}

export default function FrameGallery({ selectedFrame, setSelectedFrame }: FrameGalleryProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [frames, setFrames] = useState<Frame[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFrames = async () => {
            try {
                const framesData = await apiClient.getFrames();
                setFrames(framesData);
            } catch (error) {
                console.error("Error fetching frames:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFrames();
    }, []);

    const categories = [
        { id: "all", name: "All Frames" },
        { id: "sunglasses", name: "Sunglasses" },
        { id: "prescription", name: "Prescription" },
        { id: "sports", name: "Sports" },
    ];

    const filteredFrames = frames.filter((frame) => {
        const matchesSearch = frame.name.toLowerCase().includes(searchTerm.toLowerCase()) || frame.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || frame.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Frames</h2>
                <p className="text-gray-600">Browse our collection of premium eyewear frames</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search frames..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedCategory === category.id ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Frame Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading frames...</p>
                    </div>
                ) : (
                    filteredFrames.map((frame, index) => (
                        <motion.div
                            key={frame.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`card cursor-pointer transition-all hover:shadow-lg ${selectedFrame === frame.id ? "ring-2 ring-primary-500" : ""}`}
                            onClick={() => setSelectedFrame(frame.id)}
                        >
                            {/* Frame Image */}
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                                {frame.image_url ? (
                                    <img src={frame.image_url} alt={frame.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-4xl">🕶️</span>
                                    </div>
                                )}

                                {/* Try On Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                                    <div className="opacity-0 hover:opacity-100 transition-opacity">
                                        <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium">Try On</button>
                                    </div>
                                </div>
                            </div>

                            {/* Frame Info */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600">4.5</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600">{frame.brand}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary-600">${frame.price}</span>
                                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Try On Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => setSelectedFrame(frame.id)}
                                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Try On
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Selected Frame Info */}
            {selectedFrame && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-primary-900">{frames.find((f) => f.id === selectedFrame)?.name} Selected</h3>
                            <p className="text-primary-700">Ready to try on! Use the upload or camera feature above.</p>
                        </div>
                        <button onClick={() => setSelectedFrame(null)} className="text-primary-600 hover:text-primary-800">
                            Change Frame
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
