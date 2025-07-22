"use client"

import type React from "react"
import { Button } from "./components/button"
import { Card, CardContent } from "./components/card"
import { Upload, Play, ImageIcon, LogIn, Trash2, Edit3, X, Maximize2 } from "lucide-react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import Galaxy from "./components/Galaxy"
import TextType from "./components/TextType"

type MediaItem = {
  url: string
  type: "image" | "video"
  title: string
  description: string
}

// Custom Media Hover Effect Component
const MediaHoverEffect = ({
  mediaItems,
  onMediaClick,
  onReplace,
  onRemove,
}: {
  mediaItems: MediaItem[]
  onMediaClick: (media: MediaItem) => void
  onReplace: (index: number) => void
  onRemove: (index: number) => void
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
      {mediaItems.map((media, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Hover Background Effect */}
          <div
            className={`absolute inset-0 h-full w-full bg-white/5 backdrop-blur-md rounded-3xl transition-opacity duration-300 ${
              hoveredIndex === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Media Card */}
          <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 relative z-20 transition-all duration-300">
            <div className="relative z-50">
              {/* Media Content */}
              <div className="mb-3 relative">
                {media.type === "image" ? (
                  <div className="relative">
                    <img 
                      src={media.url} 
                      alt={media.title} 
                      className="w-full h-48 object-cover rounded cursor-pointer shadow-lg transition-transform duration-300 group-hover:scale-105" 
                      onClick={() => onMediaClick(media)}
                    />
                    {/* Full screen icon */}
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 text-black hover:bg-white p-1 h-8 w-8 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMediaClick(media)
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
                      className="w-full h-48 rounded shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Full screen icon */}
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 text-black hover:bg-white p-1 h-8 w-8 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => onMediaClick(media)}
                      >
                        <Maximize2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Action buttons - positioned at bottom left on hover */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 text-black hover:bg-white h-8 px-2 shadow-lg backdrop-blur-sm"
                    onClick={() => onReplace(idx)}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600 border-red-500 h-8 px-2 shadow-lg"
                    onClick={() => onRemove(idx)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="p-2">
                <h4 className="text-white font-bold tracking-wide text-lg mb-2 line-clamp-1 transition-colors duration-300 group-hover:text-blue-300">
                  {media.title}
                </h4>
                <p className="text-gray-300 tracking-wide leading-relaxed text-sm line-clamp-3 transition-colors duration-300 group-hover:text-gray-200">
                  {media.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
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
    <div className="min-h-screen bg-black relative">
      {/* Galaxy Background - Fixed positioned behind everything */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.3}
          saturation={0}
          hueShift={240}
        />
      </div>

      {/* Content overlay - REMOVED white background, made transparent */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black text-sm font-bold">S</span>
                </div>
                <span className="text-xl font-semibold text-white">StreamLine</span>
              </div>
              <div className="flex items-center space-x-4">
                {session?.user?.email && (
                  <>
                    <span className="text-white">{session.user.email}</span>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" onClick={() => signOut()}>
                      Logout
                    </Button>
                    <Button className="bg-white text-black hover:bg-gray-100 shadow-lg" onClick={handleChooseFileClick}>
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
                  <Button asChild variant="outline" className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
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
          {/* Uploaded Media List with Custom Hover Effect */}
          {mediaList.length > 0 && (
            <div className="mb-12">
              <TextType 
                text={[
                  `Your Media Collection (${mediaList.length} ${mediaList.length === 1 ? 'item' : 'items'})`,
                  "Your Creative Gallery",
                  "Your Digital Memories",
                  "Your Story Collection"
                ]}
                as="h2"
                className="text-2xl font-light text-center mb-8 drop-shadow-lg"
                typingSpeed={75}
                pauseDuration={2500}
                textColors={["#ffffff", "#60a5fa", "#a78bfa", "#34d399"]}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-blue-400"
              />
              
              {/* Using Custom Media Hover Effect */}
              <MediaHoverEffect 
                mediaItems={mediaList}
                onMediaClick={handleMediaClick}
                onReplace={handleReplaceFileClick}
                onRemove={handleRemoveItem}
              />
            </div>
          )}

          {/* Full Screen Media Modal */}
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
                    className="bg-white text-black hover:bg-gray-100 shadow-lg"
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
                        maxHeight: 'calc(100vh - 200px)'
                      }}
                    />
                  )}
                </div>
                
                {/* Media info */}
                <div 
                  className="bg-black bg-opacity-80 text-white p-4 text-center mt-4 backdrop-blur-sm"
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
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <Card className="border-2 border-white/20 shadow-2xl max-w-lg w-full mx-4 bg-black/80 backdrop-blur-md">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {replacingIndex !== null ? 'Replace Media' : 'Add Media Details'}
                  </h3>
                  <form onSubmit={handleMetaSubmit} className="space-y-4">
                    <div className="mb-4">
                      {mediaType === "image" ? (
                        <img src={uploadedMedia} alt="Preview" className="mx-auto max-h-64 rounded shadow-lg" />
                      ) : (
                        <video src={uploadedMedia} controls className="mx-auto max-h-64 rounded shadow-lg" />
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full border border-white/20 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-gray-300"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      rows={3}
                      className="w-full border border-white/20 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-gray-300"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                        {replacingIndex !== null ? 'Update' : 'Save'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hero Section with TextType Effects - CORRECTED SPACING */}
          <div className="text-center mb-16">
            {/* Main Heading */}
            <TextType 
              text={["Share Your Story", "Create Your Gallery", "Upload Your Memories", "Build Your Collection"]}
              as="h1"
              className="text-5xl font-light mb-4 drop-shadow-lg"
              typingSpeed={100}
              pauseDuration={3000}
              textColors={["#ffffff", "#60a5fa", "#a78bfa", "#34d399"]}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-blue-400"
            />
            
            {/* Subheading - positioned directly under main heading */}
            <div className="mt-2 mb-8">
              <TextType 
                text={[
                  "Upload and showcase your images or videos in a beautiful, minimalist interface",
                  "Create stunning galleries with our powerful media management tools",
                  "Share your creative vision with the world through elegant presentations"
                ]}
                className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md"
                typingSpeed={50}
                pauseDuration={4000}
                textColors={["#d1d5db", "#93c5fd", "#c084fc"]}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-purple-400"
                initialDelay={2000}
              />
            </div>
          </div>

          {/* Features and Call to Action with TextType */}
          <div className="mt-24 grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">High Quality</h3>
              <TextType 
                text="Upload and display your media in the highest quality possible"
                className="text-gray-300 text-sm"
                typingSpeed={30}
                showCursor={false}
                startOnVisible={true}
                initialDelay={500}
                loop={false}
              />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Video Support</h3>
              <TextType 
                text="Seamlessly upload and play videos with built-in controls"
                className="text-gray-300 text-sm"
                typingSpeed={30}
                showCursor={false}
                startOnVisible={true}
                initialDelay={800}
                loop={false}
              />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Easy Upload</h3>
              <TextType 
                text="Simple drag and drop interface for effortless media uploading"
                className="text-gray-300 text-sm"
                typingSpeed={30}
                showCursor={false}
                startOnVisible={true}
                initialDelay={1100}
                loop={false}
              />
            </div>
          </div>

          {/* Call to Action with Dynamic TextType */}
          <div className="text-center mt-24">
            <TextType 
              text={[
                "Ready to get started?",
                "Want to create something amazing?", 
                "Time to share your story!",
                "Let's build your gallery!"
              ]}
              as="h2"
              className="text-3xl font-light mb-4 drop-shadow-lg"
              typingSpeed={80}
              pauseDuration={2000}
              textColors={["#ffffff", "#60a5fa", "#34d399", "#f59e0b"]}
              showCursor={true}
              cursorCharacter="✨"
              cursorClassName="text-yellow-400"
              startOnVisible={true}
            />
            <p className="text-gray-200 mb-8">Join thousands of users sharing their stories</p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3 shadow-xl">
              Get Started
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-24 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black text-xs font-bold">S</span>
                </div>
                <span className="text-white font-medium">StreamLine</span>
              </div>
              <div className="flex space-x-8 text-sm text-gray-300">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
            <div className="text-center mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} StreamLine. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
