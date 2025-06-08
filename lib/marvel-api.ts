// Fallback placeholder image generator
export function getPlaceholderImage(title: string): string {
  // Create a deterministic color based on the title
  const hash = title.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const colors = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-red-400 to-red-600",
    "bg-gradient-to-br from-green-400 to-green-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-yellow-400 to-yellow-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
  ]

  return colors[Math.abs(hash) % colors.length]
}

export async function searchComicByTitle(title: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/marvel-proxy?title=${encodeURIComponent(title)}`)

    if (!response.ok) {
      console.error("Proxy API error:", response.status, response.statusText)
      return null
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error fetching comic cover:", error)
    return null
  }
}
