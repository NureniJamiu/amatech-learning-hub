"use client"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface FullScreenPDFViewerProps {
  fileUrl: string
  title: string
  open: boolean
  onClose: () => void
}

export function FullScreenPDFViewer({ fileUrl, title, open, onClose }: FullScreenPDFViewerProps) {
  const [loading, setLoading] = useState(true)

  // Handle escape key to close the viewer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      window.addEventListener("keydown", handleEscape)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-background p-4 shadow-md">
        <h2 className="text-xl font-semibold truncate flex-1">{title}</h2>
        <button onClick={onClose} className="cursor-pointer rounded-full p-2 hover:bg-gray-200 transition-colors" aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        )}

        <iframe
          src={fileUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          title={title}
          style={{ display: "block" }} // Ensure no extra space
        />
      </div>
    </div>
  )
}
