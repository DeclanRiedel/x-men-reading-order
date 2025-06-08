import { eraInfo } from "@/data/era-info"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EraBannerProps {
  eraName: string
  onPrevious?: () => void
  onNext?: () => void
}

export function EraBanner({ eraName, onPrevious, onNext }: EraBannerProps) {
  const era = eraInfo[eraName]

  if (!era) {
    return null
  }

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {onPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
        >
          <ChevronLeft className="h-4 w-4 text-yellow-800 dark:text-yellow-200" />
        </Button>
      )}
      {onNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
        >
          <ChevronRight className="h-4 w-4 text-yellow-800 dark:text-yellow-200" />
        </Button>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-center border-2 border-yellow-500 dark:border-yellow-600">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              {era.title}
            </h3>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{era.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {era.description}
            </p>
            <div className="text-sm">
              <span className="font-semibold">Timeline: </span>
              {era.startDate} - {era.endDate}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Notable: </span>
              {era.notable}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 