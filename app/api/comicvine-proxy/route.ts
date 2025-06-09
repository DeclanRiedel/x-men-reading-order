import { NextRequest, NextResponse } from "next/server"

const COMICVINE_API_KEY = process.env.COMICVINE_API_KEY
const COMICVINE_BASE_URL = "https://comicvine.gamespot.com/api"

export async function GET(request: NextRequest) {
  if (!COMICVINE_API_KEY) {
    console.error("ComicVine API key not configured")
    return NextResponse.json(
      { error: "ComicVine API key not configured" },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get("title")

  if (!title) {
    return NextResponse.json(
      { error: "Title parameter is required" },
      { status: 400 }
    )
  }

  try {
    // Clean the title for better matching
    const cleanTitle = title
      .replace(/\([^)]*\)/g, "") // Remove anything in parentheses
      .replace(/#\d+/g, "") // Remove issue numbers
      .replace(/Vol\.?\s*\d+/gi, "") // Remove volume numbers
      .trim()

    const params = new URLSearchParams({
      api_key: COMICVINE_API_KEY,
      format: "json",
      field_list: "image",
      query: cleanTitle,
      resources: "issue",
      limit: "1"
    })

    const response = await fetch(`${COMICVINE_BASE_URL}/search/?${params}`)
    
    if (!response.ok) {
      console.error("ComicVine API error:", await response.text())
      return NextResponse.json(
        { error: "Failed to fetch comic data" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].image?.original_url || null
      return NextResponse.json({ imageUrl })
    }

    return NextResponse.json({ imageUrl: null })
  } catch (error) {
    console.error("Error fetching comic cover:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 