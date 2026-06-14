import { maintenanceApi, type MaintenanceViewResponse } from '@/api/maintenance-api'
import PageHeader from '@/components/common/PageHeader'
import MaintenanceDetailCard from '@/components/service/view/maintenance-detail-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
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
      <PageHeader title="Detalhes da Manutenção" subtitle={data.osNumber} back={-1} />

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
