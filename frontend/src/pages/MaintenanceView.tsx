import { maintenanceApi, type MaintenanceViewResponse } from '@/api/maintenance-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Building2,
  Camera,
  ChevronLeft,
  Monitor,
  Server,
  Wrench,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function MaintenanceView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<MaintenanceViewResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        const response = await maintenanceApi.view(id)
        setData(response)
      } catch (err: any) {
        console.error('Fetch detail error:', err)
        setError('Não foi possível carregar os detalhes da manutenção.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path
    return `${API_URL}/uploads/${path}`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-slate-400 font-medium">Carregando detalhes...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center gap-4">
        <div className="p-6 bg-red-50 rounded-3xl border border-red-100 max-w-xs">
          <p className="text-sm text-red-600 font-medium">{error || 'Ordem de serviço não encontrada.'}</p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-2xl">
          Voltar ao Histórico
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-10">
      {/* Page Header */}
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border-slate-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Detalhes da Manutenção</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{data.osNumber}</p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* General Info Section */}
        <Card className="rounded-3xl shadow-sm border-slate-100 overflow-hidden">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empresa / Agência</p>
              <p className="text-sm font-bold text-slate-700">
                {data.company} - {data.agency} {data.agencyName && `(${data.agencyName})`}
              </p>
            </div>
            {data.assetNumber && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nº de Bem</p>
                <p className="text-sm font-bold text-slate-700">{data.assetNumber}</p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</p>
              <p className="text-sm font-bold text-slate-700">{data.state}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Técnico</p>
              <p className="text-sm font-bold text-slate-700">{data.technicianName || 'N/A'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data/Hora</p>
              <p className="text-sm font-bold text-slate-700">{formatDate(data.createdAt)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo</p>
              <p className="text-sm font-bold text-slate-700">{data.protocolType === 'preventive' ? 'Preventiva' : 'Corretiva'}</p>
            </div>
            {data.environmentName && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambiente</p>
                <p className="text-sm font-bold text-slate-700">{data.environmentName}</p>
              </div>
            )}
            {data.description && (
              <div className="col-span-2 space-y-0.5 mt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">{data.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Environments List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">Relatório de Ambientes</h3>

          {data.environments.map((env) => (
            <MaintenanceDetailCard
              key={env.id}
              system={env.designatedSystem}
              photos={env.photos}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 gap-3 text-base font-bold"
          >
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    </div>
  )
}

function MaintenanceDetailCard({ 
  system, 
  photos,
  getImageUrl
}: { 
  system: string; 
  photos: any[];
  getImageUrl: (path: string) => string;
}) {
  const getIcon = (sys: string) => {
    switch (sys.toLowerCase()) {
      case 'split': return <Server className="w-5 h-5" />
      case 'self': return <Building2 className="w-5 h-5" />
      case 'splitao': return <Zap className="w-5 h-5" />
      default: return <Monitor className="w-5 h-5" />
    }
  }

  return (
    <Card className="rounded-3xl shadow-sm border-slate-100 overflow-hidden bg-white p-5 space-y-5">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md">
          {getIcon(system)}
        </div>
        <div>
          <div className="flex gap-2 mt-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md italic">
              {system}
            </span>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Camera className="w-3 h-3" />
          Evidências Fotográficas ({photos.length})
        </p>
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shadow-sm group relative">
              <img 
                src={getImageUrl(photo.path)} 
                alt={photo.label} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                <span className="text-[7px] text-white font-bold truncate w-full">{photo.label}</span>
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-4 py-4 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <Wrench className="w-5 h-5 text-slate-300 mb-1" />
               <p className="text-[9px] font-bold text-slate-400 uppercase">Nenhuma foto anexada</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
