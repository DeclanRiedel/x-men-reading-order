"use client"

import { BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Comic } from "@/types/comic"
import { extractFirstAppearances } from "@/lib/utils"
import ComicCover from "./comic-cover"

interface ComicCardProps {
  comic: Comic
  isBookmarked: boolean
  onSetBookmark: (order: string) => void
  isMain: boolean
}

export default function ComicCard({ comic, isBookmarked, onSetBookmark, isMain }: ComicCardProps) {
  const firstAppearances = extractFirstAppearances(comic.Events)
  const canBeBookmarked = comic.Order.endsWith('.001')

  return (
    <div className="flex flex-col items-center space-y-3 group" data-order={comic.Order}>
      {/* Comic Cover */}
      <div className="relative">
        <div className={`p-1 rounded-lg ${comic["Main?"] === "Yes" ? "bg-blue-200 dark:bg-blue-800" : "bg-red-200 dark:bg-red-800"}`}>
          <ComicCover comic={comic} className="w-32 h-48 transition-transform group-hover:scale-105" />
        </div>

        {/* Bookmark button */}
        <div className="absolute -top-2 -right-2 flex gap-2">
          {canBeBookmarked && (
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-md ${
                isBookmarked ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => onSetBookmark(comic.Order)}
              title={isBookmarked ? "Remove bookmark" : "Set bookmark"}
            >
              <BookmarkIcon size={14} fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
          )}
        </div>
      </div>

      {/* Comic Info */}
      <div className="text-center">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white leading-tight">{comic.Book}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">Order: {comic.Order}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{comic.Published}</p>
      </div>

      {/* First Appearances Chips */}
      <div className="flex flex-wrap gap-1 justify-center max-w-32">
        {firstAppearances.slice(0, 3).map((character, index) => (
          <Badge
            key={index}
            variant="outline"
            className="text-xs px-1 py-0 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
          >
            {character.length > 10 ? `${character.slice(0, 10)}...` : character}
          </Badge>
        ))}
        {firstAppearances.length > 3 && (
          <Badge
            variant="outline"
            className="text-xs px-1 py-0 bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
          >
            +{firstAppearances.length - 3}
          </Badge>
        )}
      </div>
    </div>
  )
}
