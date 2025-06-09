import { useRef } from "react"
import { BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import ComicCard from "@/components/comic-card"
import { groupComicsByMainOrder } from "@/lib/utils"
import type { Comic } from "@/types/comic"
import { EventBanner } from "@/components/event-banner"
import { EraBanner } from "@/components/era-banner"
import { NoteBanner } from "@/components/note-banner"

interface ComicListProps {
  comics: Comic[]
  bookmark: string | null
  bookmarkRef: React.RefObject<HTMLDivElement>
  onSetBookmark: (order: string) => void
  isListView: boolean
}

export default function ComicList({ comics, bookmark, bookmarkRef, onSetBookmark, isListView }: ComicListProps) {
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
          <div key={mainOrder} className="space-y-4">
            {/* Era Banner - Full width, centered */}
            {mainComic.EraStart && (
              <div className="w-full">
                <EraBanner eraName={mainComic.EraStart} />
              </div>
            )}

            {/* Event Banner - Full width, centered */}
            {mainComic.Event && (
              <div className="w-full">
                <EventBanner eventName={mainComic.Event} />
              </div>
            )}

            {/* Note Banner - Full width, centered */}
            {mainComic.Note && (
              <div className="w-full">
                <NoteBanner noteName={mainComic.Note} />
              </div>
            )}

            <div className="relative" ref={hasBookmark ? bookmarkRef : null}>
              {isListView ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{mainComic.Book}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">#{mainComic.Order}</span>
                      </div>
                      {mainComic["Events/Characters/Universes"] && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {mainComic["Events/Characters/Universes"].split(", ").map((item, index, array) => {
                            const isFirstAppearance = item.includes("(1st)");
                            return (
                              <span key={index}>
                                <span className={isFirstAppearance ? "text-blue-600 dark:text-blue-400 font-medium" : ""}>
                                  {item}
                                </span>
                                {index < array.length - 1 ? ", " : ""}
                              </span>
                            );
                          })}
                        </p>
                      )}
                    </div>
                    {mainComic.Order.endsWith('.001') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 h-8 w-8 rounded-full ${
                          bookmark === mainComic.Order ? "text-yellow-500" : "text-gray-400"
                        }`}
                        onClick={() => onSetBookmark(mainComic.Order)}
                        title={bookmark === mainComic.Order ? "Remove bookmark" : "Set bookmark"}
                      >
                        <BookmarkIcon size={14} fill={bookmark === mainComic.Order ? "currentColor" : "none"} />
                      </Button>
                    )}
                  </div>
                  {relatedComics.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {relatedComics.map((comic) => (
                        <div key={comic.Order} className="text-sm text-gray-500 dark:text-gray-400">
                          {comic.Book} ({comic.Order})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
