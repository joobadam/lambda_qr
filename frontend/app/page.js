import { QRForm } from "@/components/QRForm"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black relative">
     
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(58, 175, 169, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(238, 130, 238, 0.3) 0%, transparent 80%)
          `,
        }}
      />
      

      <div className="relative z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">QR Code Generator</h1>
            <p className="text-lg text-gray-400">Create beautiful QR codes instantly</p>
          </div>

          <QRForm />
        </div>
      </div>
    </div>
  )
}
