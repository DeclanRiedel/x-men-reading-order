export async function searchComicByTitle(title: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/comicvine-proxy?title=${encodeURIComponent(title)}`)
    
    if (!response.ok) {
      console.error("Failed to fetch comic cover:", await response.text())
      return null
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error fetching comic cover:", error)
    return null
  }
} 