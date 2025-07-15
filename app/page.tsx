"use client"

import type React from "react"

import { Button } from "./components/button"
import { Card, CardContent } from "./components/card"
import { Upload, Play, ImageIcon, LogIn } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function Home() {
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedMedia(url)
      setMediaType(file.type.startsWith("video/") ? "video" : "image")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">StreamLine</span>
            </div>

            <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Link href="/login">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-6">Share Your Story</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and showcase your images or videos in a beautiful, minimalist interface
          </p>
        </div>

        {/* Media Upload/Display Section */}
        <div className="max-w-4xl mx-auto">
          {!uploadedMedia ? (
            <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Upload your media</h3>
                  <p className="text-gray-600 mb-6">Drag and drop your image or video here, or click to browse</p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button asChild className="bg-black hover:bg-gray-800">
                      <Link href="/login">
                        Choose File
                      </Link>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Media Display */}
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  {mediaType === "image" ? (
                    <img
                      src={uploadedMedia || "/placeholder.svg"}
                      alt="Uploaded content"
                      className="w-full h-auto max-h-[600px] object-cover"
                    />
                  ) : (
                    <video src={uploadedMedia} controls className="w-full h-auto max-h-[600px]">
                      Your browser does not support the video tag.
                    </video>
                  )}
                </CardContent>
              </Card>

              {/* Media Controls */}
              <div className="flex justify-center space-x-4">
                <label htmlFor="file-replace" className="cursor-pointer">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Upload className="w-4 h-4" />
                    <span>Replace</span>
                  </Button>
                  <input
                    id="file-replace"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedMedia(null)
                    setMediaType(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Simple Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Upload and display your media in the highest quality possible</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Video Support</h3>
            <p className="text-gray-600">Seamlessly upload and play videos with built-in controls</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600">Simple drag and drop interface for effortless media uploading</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8">Join thousands of users sharing their stories</p>
          <Button size="lg" className="bg-black hover:bg-gray-800 px-8 py-3">
            Get Started
          </Button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-100 mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-gray-900 font-medium">StreamLine</span>
            </div>

            <div className="flex space-x-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} StreamLine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
