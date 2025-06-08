"use client"

import { useState, useEffect } from "react"
import { searchComicByTitle, getPlaceholderImage } from "@/lib/marvel-api"
import type { Comic } from "@/types/comic"

interface ComicCoverProps {
  comic: Comic
  className?: string
}

export default function ComicCover({ comic, className = "" }: ComicCoverProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchCover() {
      try {
        setLoading(true)
        const url = await searchComicByTitle(comic.Book)
        setCoverUrl(url)
        setError(!url)
      } catch (err) {
        console.error("Error fetching cover:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCover()
  }, [comic.Book])

  if (loading) {
    return (
      <div className={`aspect-[2/3] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !coverUrl) {
    return (
      <div
        className={`aspect-[2/3] bg-black dark:bg-black rounded-lg flex items-center justify-center text-white font-bold text-center p-2 ${className}`}
      >
        <div className="text-xs leading-tight">{comic.Book}</div>
      </div>
    )
  }

  return (
    <img
      src={coverUrl || "/placeholder.svg"}
      alt={comic.Book}
      className={`aspect-[2/3] object-cover rounded-lg shadow-md ${className}`}
      onError={() => setError(true)}
    />
  )
}
