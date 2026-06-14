import { Card } from '@/components/ui/card'
import {
  Building2,
  Camera,
  Monitor,
  Server,
  Wrench,
  Zap
} from 'lucide-react'

interface MaintenanceDetailCardProps {
  system: string;
  photos: any[];
  getImageUrl: (path: string) => string;
}

export default function MaintenanceDetailCard({
  system,
  photos,
  getImageUrl
}: MaintenanceDetailCardProps) {
  const getIcon = (sys: string) => {
    switch (sys.toLowerCase()) {
      case 'split': return <Server className="w-5 h-5" />
      case 'self': return <Building2 className="w-5 h-5" />
      case 'splitao': return <Zap className="w-5 h-5" />
      default: return <Monitor className="w-5 h-5" />
    }
  }

  return (
    <Card className="rounded-3xl shadow-sm border-border overflow-hidden bg-card p-5 space-y-5">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-md">
          {getIcon(system)}
        </div>
        <div>
          <div className="flex gap-2 mt-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-secondary text-muted-foreground rounded-md italic">
              {system}
            </span>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Camera className="w-3 h-3" />
          Evidências Fotográficas ({photos.length})
        </p>
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square bg-muted rounded-xl border border-border overflow-hidden shadow-sm group relative">
              <img
                src={getImageUrl(photo.path)}
                alt={photo.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                <span className="text-[7px] text-background font-bold truncate w-full">{photo.label}</span>
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-4 py-4 flex flex-col items-center justify-center bg-muted rounded-2xl border border-dashed border-border">
               <Wrench className="w-5 h-5 text-muted-foreground mb-1" />
               <p className="text-[9px] font-bold text-muted-foreground uppercase">Nenhuma foto anexada</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
