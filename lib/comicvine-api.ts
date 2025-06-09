import { useState, useEffect } from "react"

export function getPlaceholderImage(title: string): string {
  // Generate a deterministic color based on the title
  const hash = title.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  const hue = Math.abs(hash % 360)
  return `https://placehold.co/400x600/${hue.toString(16).padStart(6, "0")}/ffffff?text=${encodeURIComponent(title)}`
}

interface ComicCoverResponse {
  imageUrl: string | null
  issueNumber?: string
  volume?: string
  coverDate?: string
}

export function useComicCover(title: string, published?: string, writer?: string) {
  const [data, setData] = useState<ComicCoverResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCover() {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({ title })
        if (published) params.append("published", published)
        if (writer) params.append("writer", writer)

        const response = await fetch(`/api/comicvine-proxy?${params}`)
        if (!response.ok) {
          throw new Error("Failed to fetch comic cover")
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCover()
  }, [title, published, writer])

  return { data, isLoading, error }
}

interface SearchParams {
  issue?: string
  year?: string
  volume?: string
}

export async function searchComicByTitle(
  title: string,
  params?: SearchParams
): Promise<string | null> {
  try {
    const searchParams = new URLSearchParams({ title })
    if (params?.issue) searchParams.append("issue", params.issue)
    if (params?.year) searchParams.append("year", params.year)
    if (params?.volume) searchParams.append("volume", params.volume)

    const response = await fetch(`/api/comicvine-proxy?${searchParams}`)
    
    if (!response.ok) {
      throw new Error("Failed to fetch comic cover")
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error searching comic:", error)
    return null
  }
} 