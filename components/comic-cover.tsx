"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Comic } from "@/types/comic"

interface ComicCoverProps {
  comic: Comic
  className?: string
}

export function ComicCover({ comic, className = "" }: ComicCoverProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCover = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams({
          book: comic.Book,
          published: comic.Published
        })

        const response = await fetch(`/api/comic-cover?${params}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch comic cover")
        }

        setImageUrl(data.imageUrl)
      } catch (err) {
        console.error("Error fetching comic cover:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch comic cover")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCover()
  }, [comic.Book, comic.Published])

  if (isLoading) {
    return (
      <div className={`relative aspect-[2/3] bg-gray-200 animate-pulse ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !imageUrl) {
    return (
      <div className={`relative aspect-[2/3] bg-gray-200 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span className="text-sm text-center px-2">No cover available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-[2/3] ${className}`}>
      <Image
        src={imageUrl}
        alt={`Cover for ${comic.Book}`}
        fill
        className="object-cover rounded-lg shadow-md"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
