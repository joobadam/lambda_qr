"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, RotateCcw } from "lucide-react"
import { toast } from "sonner"

export function QRDisplay({ qrResult, onReset }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrResult.qrCodeUrl)
      toast.success("URL copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy URL")
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(qrResult.qrCodeUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `qr-code-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      toast.success("QR Code downloaded!")
    } catch (err) {
      console.error("Download error:", err)
      toast.error("Failed to download QR code")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/5 border-white/10 shadow-2xl animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">QR Code Generated!</CardTitle>
        <CardDescription className="text-gray-400">Your QR code is ready</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            {!imageLoaded && (
              <div className="w-64 h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={qrResult.qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className={`w-64 h-64 rounded-lg shadow-lg transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Original Text:</p>
            <p className="text-white font-medium break-all">{qrResult.text}</p>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Size: {qrResult.size}px</span>
            <span>Level: {qrResult.errorCorrectionLevel}</span>
          </div>

          <div className="text-xs text-gray-600 text-center">
            Generated: {new Date(qrResult.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-black text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] border border-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleCopyUrl}
            className="flex-1 bg-black text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] border border-gray-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy URL
          </Button>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] bg-black"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Generate Another
        </Button>
      </CardContent>
    </Card>
  )
}
