import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(request: Request) {
  try {
    // In a real app, you would fetch this from a database
    // For now, we'll read from the sample data file
    const filePath = path.join(process.cwd(), "data", "sample-data.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const comics = JSON.parse(fileContents)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    // Filter comics if search parameter is provided
    let filteredComics = comics
    if (search) {
      filteredComics = comics.filter(
        (comic: any) =>
          comic.Book.toLowerCase().includes(search.toLowerCase()) ||
          comic.Events.toLowerCase().includes(search.toLowerCase()) ||
          comic.Writer.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedComics = filteredComics.slice(startIndex, endIndex)

    return NextResponse.json({
      comics: paginatedComics,
      total: filteredComics.length,
      page,
      limit,
      hasMore: endIndex < filteredComics.length,
    })
  } catch (error) {
    console.error("Error fetching comics:", error)
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 })
  }
}
