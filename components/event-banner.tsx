import { eventInfo } from "@/data/event-info"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EventBannerProps {
  eventName: string
}

export function EventBanner({ eventName }: EventBannerProps) {
  const event = eventInfo[eventName]

  if (!event) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-center border-2 border-orange-500 dark:border-orange-600 flex items-center">
          <span className="font-bold text-orange-800 dark:text-orange-200 px-4 border-r-2 border-orange-500 dark:border-orange-600">Event</span>
          <h3 className="font-semibold text-orange-800 dark:text-orange-200 flex-1">
            {event.title}
          </h3>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {event.description}
          </p>
          {event.startDate && (
            <div className="text-sm">
              <span className="font-semibold">Timeline: </span>
              {event.startDate}
              {event.endDate && ` - ${event.endDate}`}
            </div>
          )}
          {event.keyIssues && event.keyIssues.length > 0 && (
            <div className="text-sm">
              <span className="font-semibold">Key Issues: </span>
              <ul className="list-disc pl-5 mt-1">
                {event.keyIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {event.impact && (
            <div className="text-sm">
              <span className="font-semibold">Impact: </span>
              {event.impact}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 