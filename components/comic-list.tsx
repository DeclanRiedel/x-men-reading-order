import type React from "react"
import type { Comic } from "@/types/comic"
import ComicCard from "./comic-card"
import { groupComicsByMainOrder } from "@/lib/utils"

interface ComicListProps {
  comics: Comic[]
  bookmark: string | null
  bookmarkRef: React.RefObject<HTMLDivElement>
  onSetBookmark: (order: string) => void
}

export default function ComicList({ comics, bookmark, bookmarkRef, onSetBookmark }: ComicListProps) {
  // Group comics by their main order (before the decimal point)
  const groupedComics = groupComicsByMainOrder(comics)

  return (
    <div className="space-y-8">
      {Object.entries(groupedComics).map(([mainOrder, comicsGroup]) => {
        // Sort comics within the group by their full order
        const sortedComics = comicsGroup.sort((a, b) => Number.parseFloat(a.Order) - Number.parseFloat(b.Order))

        // The main comic is the one with the lowest order in the group
        const mainComic = sortedComics[0]
        // Related comics are all others in the group
        const relatedComics = sortedComics.slice(1)

        // Check if this group contains the bookmarked comic
        const hasBookmark = bookmark && sortedComics.some((comic) => comic.Order === bookmark)

        return (
          <div
            key={mainOrder}
            className="relative"
            ref={hasBookmark ? bookmarkRef : null}
          >
            {/* Bookmark indicator */}
            {hasBookmark && (
              <div
                ref={bookmarkRef}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"
              />
            )}

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Main comic */}
              <div className="flex-shrink-0">
                <ComicCard
                  comic={mainComic}
                  isBookmarked={bookmark === mainComic.Order}
                  onSetBookmark={onSetBookmark}
                  isMain={true}
                />
              </div>

              {/* Related comics */}
              {relatedComics.length > 0 && (
                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-4 pb-2 min-w-max">
                    {relatedComics.map((comic) => (
                      <div key={comic.Order} className="flex-shrink-0">
                        <ComicCard
                          comic={comic}
                          isBookmarked={bookmark === comic.Order}
                          onSetBookmark={onSetBookmark}
                          isMain={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
