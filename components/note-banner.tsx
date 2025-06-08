import { noteInfo } from "@/data/note-info"

interface NoteBannerProps {
  noteName: string
}

export function NoteBanner({ noteName }: NoteBannerProps) {
  if (!noteName) {
    return null
  }

  return (
    <div className="w-full bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-center border-2 border-purple-500 dark:border-purple-600">
      <h3 className="font-semibold text-purple-800 dark:text-purple-200">
        {noteName}
      </h3>
    </div>
  )
} 