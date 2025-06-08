import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const MARVEL_PUBLIC_KEY = process.env.NEXT_PUBLIC_MARVEL_PUBLIC_KEY || ""
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || ""
const MARVEL_BASE_URL = "https://gateway.marvel.com/v1/public"

function generateMarvelAuth() {
  const ts = Date.now().toString()
  const hash = crypto
    .createHash("md5")
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest("hex")

  return {
    ts,
    apikey: MARVEL_PUBLIC_KEY,
    hash,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")

  if (!title) {
    return NextResponse.json({ error: "Title parameter is required" }, { status: 400 })
  }

  try {
    // Clean up the title for better matching
    const cleanTitle = title
      .replace(/vol\.\s*\d+\s*#/i, "")
      .replace(/#\d+/g, "")
      .trim()

    const auth = generateMarvelAuth()
    const params = new URLSearchParams({
      ...auth,
      title: cleanTitle,
      limit: "1",
      orderBy: "onsaleDate",
    })

    const response = await fetch(`${MARVEL_BASE_URL}/comics?${params}`)

    if (!response.ok) {
      console.error("Marvel API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Marvel API error" }, { status: response.status })
    }

    const data = await response.json()

    if (data.data.results.length > 0) {
      const comic = data.data.results[0]
      // Prefer images over thumbnail if available
      const image = comic.images.length > 0 ? comic.images[0] : comic.thumbnail
      const imageUrl = `${image.path}.${image.extension}`

      return NextResponse.json({ imageUrl })
    }

    return NextResponse.json({ imageUrl: null })
  } catch (error) {
    console.error("Error fetching comic cover:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
