import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InfoDialog({ open, onOpenChange }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About This Reading Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            This list was adapted from{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1B8Eo12J21Rxu1KVPEEkrhsgJyJvq6h7SYt4WMEtvjmw/edit#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              @DoctorSloshee's X-Men Reading Order
            </a>
          </p>
          <p>
            With extra entries loosely adapted from{" "}
            <a
              href="https://comicbookreadingorders.com/marvel/characters/x-men-reading-order/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Comic Book Reading Orders
            </a>
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Color Coding:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="text-blue-500">Blue borders</span> = Main 616 universe
              </li>
              <li>
                <span className="text-red-500">Red borders</span> = Spin-offs/Elseworlds
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Note: You should not attempt to read all 10,000 of these comics, that would be nuts.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 