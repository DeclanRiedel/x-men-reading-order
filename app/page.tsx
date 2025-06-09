"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, BookmarkIcon, Github, HelpCircle, List, Grid } from "lucide-react"
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
  const [isListView, setIsListView] = useState(false)
  const ITEMS_PER_PAGE = 50 // Increased from 20 to 50 for faster loading
  const [showInfo, setShowInfo] = useState(false)
  const [backgroundPattern, setBackgroundPattern] = useState<Array<{
    size: number;
    top: number;
    left: number;
    rotation: number;
    opacity: number;
  }>>([])

  const bookmarkRef = useRef<HTMLDivElement>(null!)

  // Generate background pattern
  useEffect(() => {
    const pattern = Array.from({ length: 10 }).map(() => ({
      size: Math.random() * 15 + 10,
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.1
    }))
    setBackgroundPattern(pattern)
  }, [])

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
    
    // Always set the page to ensure we load enough content
    setPage(requiredPage)
    
    // Wait for the next render cycle to ensure the comic is loaded
    setTimeout(() => {
      const comicElement = document.querySelector(`[data-order="${comic.Order}"]`)
      if (comicElement) {
        const rect = comicElement.getBoundingClientRect()
        const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
        window.scrollTo({ top: scrollTop, behavior: "smooth" })
      } else {
        // If element not found, try again after a short delay
        setTimeout(() => {
          const retryElement = document.querySelector(`[data-order="${comic.Order}"]`)
          if (retryElement) {
            const rect = retryElement.getBoundingClientRect()
            const scrollTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
            window.scrollTo({ top: scrollTop, behavior: "smooth" })
          }
        }, 100)
      }
    }, 100)
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
    <main className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold whitespace-nowrap">X-Men Reading Order</h1>
              <a 
                href="https://www.reddit.com/r/xmen/comments/15a71l3/the_comprehensive_xmen_reading_list_2023_update/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Credit to: u/DoctorSloshee
              </a>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
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
                  <CommandList className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg border shadow-lg max-h-[180px] w-full">
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
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsListView(!isListView)}
              title={isListView ? "Switch to Grid View" : "Switch to List View"}
            >
              {isListView ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href="https://github.com/DeclanRiedel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-24 px-4 md:px-8 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ComicList
            comics={paginatedComics}
            bookmark={bookmark}
            bookmarkRef={bookmarkRef}
            onSetBookmark={handleSetBookmark}
            isListView={isListView}
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
