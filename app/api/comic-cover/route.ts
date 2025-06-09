import { NextRequest, NextResponse } from "next/server"

const COMICVINE_API_KEY = process.env.COMICVINE_API_KEY
const COMICVINE_BASE_URL = "https://comicvine.gamespot.com/api"

// Helper to fetch the volume ID
async function fetchVolumeId(title: string, year: string) {
  const cleanTitle = title
    .replace(/Vol\.\s*\d+/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/#\d+/g, "")
    .trim()

  const params = new URLSearchParams({
    api_key: COMICVINE_API_KEY!,
    format: "json",
    filter: `name:${cleanTitle},start_year:${year}`,
    field_list: "id,name,start_year",
    sort: "start_year:asc",
    limit: "5"
  })

  console.log("Searching for volume with params:", {
    cleanTitle,
    year,
    query: params.toString()
  })

  const res = await fetch(`${COMICVINE_BASE_URL}/volumes/?${params}`)
  const data = await res.json()

  if (!res.ok) {
    console.error("Volume search error:", data)
    throw new Error("Failed to search volumes")
  }

  if (data.results && data.results.length > 0) {
    console.log("Found volume:", data.results[0])
    return data.results[0].id
  }

  console.log("No volume found for:", { cleanTitle, year })
  return null
}

// Main GET handler
export async function GET(request: NextRequest) {
  if (!COMICVINE_API_KEY) {
    console.error("COMICVINE_API_KEY is not configured")
    return NextResponse.json(
      { error: "ComicVine API key not configured" },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const book = searchParams.get("book")
  const published = searchParams.get("published")

  if (!book || !published) {
    return NextResponse.json(
      { error: "Book title and publication date are required" },
      { status: 400 }
    )
  }

  try {
    // Extract series name and issue number
    const titleMatch = book.match(/^(.+?)(?:\s+#(\d+))?$/)
    if (!titleMatch) {
      return NextResponse.json(
        { error: "Invalid book title format" },
        { status: 400 }
      )
    }

    const seriesName = titleMatch[1].trim()
    const issueNumber = titleMatch[2]
    const year = new Date(published).getFullYear().toString()

    if (!issueNumber) {
      return NextResponse.json(
        { error: "Issue number is required" },
        { status: 400 }
      )
    }

    console.log("Processing request:", {
      seriesName,
      issueNumber,
      year
    })

    // First, find the volume ID
    const volumeId = await fetchVolumeId(seriesName, year)
    if (!volumeId) {
      return NextResponse.json(
        { error: "Volume not found" },
        { status: 404 }
      )
    }

    // Then fetch the specific issue
    const params = new URLSearchParams({
      api_key: COMICVINE_API_KEY,
      format: "json",
      filter: `issue_number:${issueNumber},volume:${volumeId}`,
      field_list: "image,issue_number,volume,cover_date",
      limit: "1"
    })

    console.log("Searching for issue with params:", params.toString())

    const response = await fetch(`${COMICVINE_BASE_URL}/issues/?${params}`)
    const data = await response.json()

    if (!response.ok) {
      console.error("Issue search error:", data)
      return NextResponse.json(
        { error: "Failed to fetch issue data" },
        { status: response.status }
      )
    }

    if (data.results && data.results.length > 0) {
      const comic = data.results[0]
      console.log("Found comic:", {
        issueNumber: comic.issue_number,
        volumeName: comic.volume?.name,
        coverDate: comic.cover_date
      })
      
      return NextResponse.json({
        imageUrl: comic.image?.original_url || null,
        issueNumber: comic.issue_number,
        volumeName: comic.volume?.name,
        coverDate: comic.cover_date
      })
    }

    console.log("No issue found for:", {
      seriesName,
      issueNumber,
      volumeId
    })
    
    return NextResponse.json({ imageUrl: null }, { status: 404 })
  } catch (error) {
    console.error("Error fetching comic cover:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 