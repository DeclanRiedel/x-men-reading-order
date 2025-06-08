import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Comic } from "@/types/comic"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Group comics by their main order (before the decimal point)
export function groupComicsByMainOrder(comics: Comic[]): Record<string, Comic[]> {
  const grouped: Record<string, Comic[]> = {}

  comics.forEach((comic) => {
    // Extract the main order number (before the decimal)
    const mainOrder = comic.Order.split(".")[0]

    if (!grouped[mainOrder]) {
      grouped[mainOrder] = []
    }

    grouped[mainOrder].push(comic)
  })

  return grouped
}

// Extract first appearances from the Events/Characters/Universes field
export function extractFirstAppearances(events: string): string[] {
  const firstAppearances: string[] = []

  // Match patterns like "Character Name (1st)"
  const regex = /([^,]+)\s*$$1st$$/g
  let match

  while ((match = regex.exec(events)) !== null) {
    firstAppearances.push(match[1].trim())
  }

  return firstAppearances
}
