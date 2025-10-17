"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRDisplay } from "./QRDisplay"
import { toast } from "sonner"

export function QRForm() {
  const [text, setText] = useState("")
  const [size, setSize] = useState(300)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrResult, setQrResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setQrResult(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    
    if (!apiUrl || apiUrl === "undefined" || apiUrl === "http://localhost:3000") {
      console.log("Using mock data for testing")

   
      await new Promise((resolve) => setTimeout(resolve, 1500))

 
      const mockResult = {
        success: true,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
        text: text,
        size: size,
        errorCorrectionLevel: errorCorrectionLevel,
        timestamp: new Date().toISOString(),
        filename: `qr-${Date.now()}.png`,
      }

      setQrResult(mockResult)
      toast.success("QR Code generated successfully!")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, size, errorCorrectionLevel }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setQrResult(data)
        toast.success("QR Code generated successfully!")
      } else {
        setError(data.error || "Failed to generate QR code")
        toast.error(data.error || "Failed to generate QR code")
      }
    } catch (err) {
      console.error("API Error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(`Network error: ${errorMessage}. Please check if the backend is running.`)
      toast.error(`Network error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setText("")
    setSize(300)
    setErrorCorrectionLevel("M")
    setError("")
    setQrResult(null)
  }

  if (qrResult) {
    return <QRDisplay qrResult={qrResult} onReset={resetForm} />
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/5 border-white/10 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Generate QR Code</CardTitle>
        <CardDescription className="text-gray-400">Create beautiful QR codes instantly</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-white font-medium">
              Text or URL
            </Label>
            <Input
              id="text"
              type="text"
              placeholder="Enter URL or text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
            <p className="text-xs text-gray-500">{text.length}/2000 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size" className="text-white font-medium">
              Size
            </Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
            >
              <option value={200} className="bg-gray-950">
                Small (200px)
              </option>
              <option value={300} className="bg-gray-950">
                Medium (300px)
              </option>
              <option value={500} className="bg-gray-950">
                Large (500px)
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorLevel" className="text-white font-medium">
              Error Correction
            </Label>
            <select
              id="errorLevel"
              value={errorCorrectionLevel}
              onChange={(e) => setErrorCorrectionLevel(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
            >
              <option value="L" className="bg-gray-950">
                Low (L)
              </option>
              <option value="M" className="bg-gray-950">
                Medium (M)
              </option>
              <option value="Q" className="bg-gray-950">
                Quality (Q)
              </option>
              <option value="H" className="bg-gray-950">
                High (H)
              </option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="uiverse"
          >
            <div className="wrapper">
              <span>{loading ? "GENERATING..." : "GENERATE QR CODE"}</span>
              <div className="circle circle-12"></div>
              <div className="circle circle-11"></div>
              <div className="circle circle-10"></div>
              <div className="circle circle-9"></div>
              <div className="circle circle-8"></div>
              <div className="circle circle-7"></div>
              <div className="circle circle-6"></div>
              <div className="circle circle-5"></div>
              <div className="circle circle-4"></div>
              <div className="circle circle-3"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-1"></div>
            </div>
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
