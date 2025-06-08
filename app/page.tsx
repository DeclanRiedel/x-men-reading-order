"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, BookmarkIcon, Github, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"
import { ThemeToggle } from "@/components/theme-toggle"
import ComicList from "@/components/comic-list"
import type { Comic } from "@/types/comic"
import sampleData from "@/data/sample-data.json"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { InfoDialog } from "@/components/info-dialog"

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([])
  const [filteredComics, setFilteredComics] = useState<Comic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmark, setBookmark] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const ITEMS_PER_PAGE = 50 // Increased from 20 to 50 for faster loading
  const [showInfo, setShowInfo] = useState(false)

  const bookmarkRef = useRef<HTMLDivElement>(null!)

  // Load initial data
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const allComics = sampleData as Comic[]
    setComics(allComics)
    setFilteredComics(allComics)

    // Check for saved bookmark in localStorage
    const savedBookmark = localStorage.getItem("xmenBookmark")
    if (savedBookmark) {
      setBookmark(savedBookmark)
    }
  }, [])

  // Filter comics based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredComics(comics)
      setShowSearchDropdown(false)
    } else {
      const filtered = comics.filter(
        (comic) => comic.Book.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredComics(filtered)
      setShowSearchDropdown(true)
    }
  }, [searchQuery, comics])

  // Pagination logic
  const loadMoreComics = useCallback(() => {
    if (page * ITEMS_PER_PAGE >= comics.length) {
      setHasMore(false)
      return
    }
    setPage((prevPage) => prevPage + 1)
  }, [page, comics.length])

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreComics()
    }
  }, [inView, hasMore, loadMoreComics])

  // Get paginated comics
  const paginatedComics = comics.slice(0, page * ITEMS_PER_PAGE)

  // Handle search selection
  const handleSearchSelect = (comic: Comic) => {
    setSearchQuery(comic.Book)
    setShowSearchDropdown(false)
    
    // Calculate how many pages we need to load to get to this comic
    const comicIndex = comics.findIndex(c => c.Order === comic.Order)
    const requiredPage = Math.ceil((comicIndex + 1) / ITEMS_PER_PAGE)
    
    // If we need to load more pages, do so
    if (requiredPage > page) {
      setPage(requiredPage)
      // Wait for the next render cycle to ensure the comic is loaded
      setTimeout(() => {
        const comicElement = document.querySelector(`[data-order="${comic.Order}"]`)
        if (comicElement) {
          const rect = comicElement.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
          window.scrollTo({ top: scrollTop, behavior: "smooth" })
        }
      }, 100)
    } else {
      // If the comic is already loaded, scroll to it immediately
      const comicElement = document.querySelector(`[data-order="${comic.Order}"]`)
      if (comicElement) {
        const rect = comicElement.getBoundingClientRect()
        const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
        window.scrollTo({ top: scrollTop, behavior: "smooth" })
      }
    }
  }

  // Jump to bookmark
  const scrollToBookmark = () => {
    if (bookmark && bookmarkRef.current) {
      const rect = bookmarkRef.current.getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
      window.scrollTo({ top: scrollTop, behavior: "smooth" })
    }
  }

  // Set bookmark
  const handleSetBookmark = (order: string) => {
    setBookmark(order)
    localStorage.setItem("xmenBookmark", order)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-blue-900 dark:to-blue-800 relative overflow-hidden">
      {/* Background X Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        {Array.from({ length: 10 }).map((_, i) => {
          const size = Math.random() * 15 + 10 // Random size between 10rem and 25rem
          const top = Math.random() * 100 // Random top position
          const left = Math.random() * 100 // Random left position
          const rotation = Math.random() * 360 // Random rotation
          const opacity = Math.random() * 0.3 + 0.1 // Random opacity between 0.1 and 0.4
          
          return (
            <div
              key={i}
              className="absolute font-bold text-gray-300 dark:text-gray-700 select-none"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                fontSize: `${size}rem`,
                transform: `rotate(${rotation}deg)`,
                opacity: opacity
              }}
            >
              X
            </div>
          )
        })}
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">X-Men Reading Order</h1>
              <a 
                href="https://www.reddit.com/r/xmen/comments/15a71l3/the_comprehensive_xmen_reading_list_2023_update/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Credit to: u/DoctorSloshee
              </a>
            </div>

            <div className="relative flex-1 max-w-md">
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search issues..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredComics.length > 0) {
                      handleSearchSelect(filteredComics[0])
                    }
                  }}
                />
                {showSearchDropdown && (
                  <CommandList className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg border shadow-lg max-h-[180px]">
                    <CommandEmpty>No issues found.</CommandEmpty>
                    <CommandGroup>
                      {filteredComics.slice(0, 5).map((comic) => (
                        <CommandItem
                          key={comic.Order}
                          onSelect={() => handleSearchSelect(comic)}
                        >
                          {comic.Book}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={scrollToBookmark}
                disabled={!bookmark}
                title="Jump to Bookmark"
              >
                <BookmarkIcon size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowInfo(true)}
                title="About this reading order"
              >
                <HelpCircle size={16} />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                asChild
              >
                <a
                  href="https://github.com/DeclanRiedel"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub Profile"
                >
                  <Github size={16} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-4 md:px-8 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ComicList
            comics={paginatedComics}
            bookmark={bookmark}
            bookmarkRef={bookmarkRef}
            onSetBookmark={handleSetBookmark}
          />

          {hasMore && (
            <div ref={ref} className="flex justify-center p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="h-3 w-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="h-3 w-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="h-3 w-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              Showing {paginatedComics.length} of {comics.length} comics
            </p>
          )}

          {filteredComics.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No comics found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Dialog */}
      <InfoDialog open={showInfo} onOpenChange={setShowInfo} />
    </main>
  )
}
