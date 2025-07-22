"use client"

import type React from "react"
import { Button } from "./components/button"
import { Card, CardContent } from "./components/card"
import { Upload, Play, ImageIcon, LogIn, Trash2, Edit3, X, Maximize2 } from "lucide-react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

type MediaItem = {
  url: string
  type: "image" | "video"
  title: string
  description: string
}

export default function Home() {
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const [showMetaForm, setShowMetaForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [fullScreenMedia, setFullScreenMedia] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceFileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()

  const handleChooseFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleReplaceFileClick = (index: number) => {
    setReplacingIndex(index)
    replaceFileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedMedia(url)
      setMediaType(file.type.startsWith("video/") ? "video" : "image")
      setShowMetaForm(true)
    }
  }

  const handleReplaceFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && replacingIndex !== null) {
      const url = URL.createObjectURL(file)
      setUploadedMedia(url)
      setMediaType(file.type.startsWith("video/") ? "video" : "image")
      
      // Pre-fill form with existing data
      const existingItem = mediaList[replacingIndex]
      setTitle(existingItem.title)
      setDescription(existingItem.description)
      setShowMetaForm(true)
    }
  }

  const handleMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedMedia && mediaType) {
      if (replacingIndex !== null) {
        // Replace existing item
        const updatedList = [...mediaList]
        updatedList[replacingIndex] = { url: uploadedMedia, type: mediaType, title, description }
        setMediaList(updatedList)
        setReplacingIndex(null)
      } else {
        // Add new item
        setMediaList([
          { url: uploadedMedia, type: mediaType, title, description },
          ...mediaList,
        ])
      }
      
      setUploadedMedia(null)
      setMediaType(null)
      setTitle("")
      setDescription("")
      setShowMetaForm(false)
    }
  }

  const handleRemoveItem = (index: number) => {
    const updatedList = mediaList.filter((_, i) => i !== index)
    setMediaList(updatedList)
  }

  const handleCancel = () => {
    setUploadedMedia(null)
    setMediaType(null)
    setShowMetaForm(false)
    setTitle("")
    setDescription("")
    setReplacingIndex(null)
  }

  const handleMediaClick = (media: MediaItem) => {
    setFullScreenMedia(media)
  }

  const closeFullScreen = () => {
    setFullScreenMedia(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">StreamLine</span>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user?.email && (
                <>
                  <span className="text-gray-900">{session.user.email}</span>
                  <Button variant="outline" className="bg-transparent" onClick={() => signOut()}>
                    Logout
                  </Button>
                  <Button className="bg-black hover:bg-gray-800" onClick={handleChooseFileClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    ref={replaceFileInputRef}
                    id="file-replace"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleReplaceFileUpload}
                    className="hidden"
                  />
                </>
              )}
              {!session?.user?.email && (
                <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Link href="/login">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Uploaded Media List at the Top - Grid Layout */}
        {mediaList.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 text-center mb-8">Your Media Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaList.map((media, idx) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow group">
                  <CardContent className="p-4">
                    <div className="mb-3 relative">
                      {media.type === "image" ? (
                        <div className="relative">
                          <img 
                            src={media.url} 
                            alt={media.title} 
                            className="w-full h-48 object-cover rounded cursor-pointer" 
                            onClick={() => handleMediaClick(media)}
                          />
                          {/* Full screen icon - always visible on images */}
                          <div className="absolute top-2 right-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white bg-opacity-80 text-black hover:bg-white p-1 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMediaClick(media)
                              }}
                            >
                              <Maximize2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <video 
                            src={media.url} 
                            controls 
                            className="w-full h-48 rounded"
                          />
                          {/* Full screen icon for videos */}
                          <div className="absolute top-2 right-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white bg-opacity-80 text-black hover:bg-white p-1 h-8 w-8"
                              onClick={() => handleMediaClick(media)}
                            >
                              <Maximize2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Action buttons - positioned at bottom left on hover */}
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100 h-8 px-2"
                          onClick={() => handleReplaceFileClick(idx)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Replace
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500 text-white hover:bg-red-600 border-red-500 h-8 px-2"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{media.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{media.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Full Screen Media Modal - FIXED VERSION */}
        {fullScreenMedia && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={closeFullScreen}
          >
            <div className="relative w-full h-full max-w-6xl max-h-full flex flex-col">
              {/* Close button */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100"
                  onClick={closeFullScreen}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Media content - properly sized container */}
              <div className="flex-1 flex items-center justify-center min-h-0">
                {fullScreenMedia.type === "image" ? (
                  <img 
                    src={fullScreenMedia.url} 
                    alt={fullScreenMedia.title} 
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <video 
                    src={fullScreenMedia.url} 
                    controls 
                    autoPlay
                    className="w-full h-auto max-w-full max-h-[80vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxHeight: 'calc(100vh - 200px)' // Reserve space for title/description
                    }}
                  />
                )}
              </div>
              
              {/* Media info */}
              <div 
                className="bg-black bg-opacity-80 text-white p-4 text-center mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-2">{fullScreenMedia.title}</h3>
                <p className="text-gray-300">{fullScreenMedia.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Show Meta Form as Modal/Card */}
        {showMetaForm && uploadedMedia && mediaType && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <Card className="border-2 border-gray-200 shadow-lg max-w-lg w-full mx-4">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">
                  {replacingIndex !== null ? 'Replace Media' : 'Add Media Details'}
                </h3>
                <form onSubmit={handleMetaSubmit} className="space-y-4">
                  <div className="mb-4">
                    {mediaType === "image" ? (
                      <img src={uploadedMedia} alt="Preview" className="mx-auto max-h-64 rounded" />
                    ) : (
                      <video src={uploadedMedia} controls className="mx-auto max-h-64 rounded" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                  <div className="flex space-x-4">
                    <Button type="submit" className="bg-black hover:bg-gray-800">
                      {replacingIndex !== null ? 'Update' : 'Save'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-6">Share Your Story</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and showcase your images or videos in a beautiful, minimalist interface
          </p>
        </div>

        {/* Features and Call to Action */}
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

      {/* Footer */}
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
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
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
