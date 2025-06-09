import { NextRequest, NextResponse } from "next/server"
import type { Comic } from "@/types/comic"

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
  const issue = searchParams.get("issue")
  const year = searchParams.get("year")
  const volume = searchParams.get("volume")

  if (!title) {
    return NextResponse.json(
      { error: "Title parameter is required" },
      { status: 400 }
    )
  }

  try {
    // Clean the title for better matching
    // Remove volume numbers and parenthetical content
    const cleanTitle = title
      .replace(/\([^)]*\)/g, "") // Remove parenthetical content
      .replace(/Vol\.?\s*\d+/gi, "") // Remove volume numbers
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()

    console.log("Searching for comic:", {
      cleanTitle,
      issue,
      year,
      volume
    })

    // Build the filter query
    const filters = []
    
    // Add title filter with wildcards for better matching
    filters.push(`name:*${cleanTitle}*`)
    
    if (issue) {
      filters.push(`issue_number:${issue}`)
    }
    if (year) {
      filters.push(`cover_date:${year}`)
    }
    if (volume) {
      filters.push(`volume:${volume}`)
    }

    const params = new URLSearchParams({
      api_key: COMICVINE_API_KEY,
      format: "json",
      field_list: "name,cover_date,image,issue_number,volume",
      filter: filters.join(","),
      sort: "cover_date:desc", // Get the most recent match
      limit: "1" // Limit to 1 result
    })

    const apiUrl = `${COMICVINE_BASE_URL}/issues/?${params}`
    console.log("ComicVine API URL:", apiUrl)

    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("ComicVine API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      return NextResponse.json(
        { error: "Failed to fetch from ComicVine API" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("ComicVine API response:", {
      results: data.results?.length || 0,
      firstResult: data.results?.[0]
    })
    
    if (data.results && data.results.length > 0) {
      const comic = data.results[0]
      return NextResponse.json({
        imageUrl: comic.image?.original_url || null,
        issueNumber: comic.issue_number,
        volume: comic.volume?.name,
        coverDate: comic.cover_date
      })
    }

    return NextResponse.json({ imageUrl: null })
  } catch (error) {
    console.error("Error fetching comic data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 