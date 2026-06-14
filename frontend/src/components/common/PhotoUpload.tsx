import { Card } from '@/components/ui/card'
import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'

interface PhotoUploadProps {
  id: string
  label: string
  description: string
  icon: ReactNode
  previewUrl?: string
  onSelect: (file: File | null) => void
}

export default function PhotoUpload({ id, label, description, icon, previewUrl, onSelect }: PhotoUploadProps) {
  const inputId = `file-${id}`

  const triggerFilePicker = () => {
    const input = document.getElementById(inputId) as HTMLInputElement
    input?.click()
  }

  return (
    <div>
      <input
        type="file"
        id={inputId}
        className="hidden"
        accept="image/*"
        onChange={(e) => onSelect(e.target.files?.[0] || null)}
      />
      <Card
        onClick={triggerFilePicker}
        className={`group rounded-2xl p-4 flex items-center gap-4 border-2 transition-all cursor-pointer shadow-sm ${previewUrl ? 'border-primary bg-blue-50/30' : 'border-transparent bg-slate-50 hover:border-slate-200'
          }`}
      >
        <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div className="grow">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{label}</h4>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{description}</p>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center transition-all overflow-hidden ${previewUrl ? 'border-2 border-primary shadow-md' : 'bg-slate-100 text-slate-300 rounded-full'
          }`}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </div>
      </Card>
    </div>
  )
}
