import EnvironmentItem from '@/components/service/review/environment-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  Send,
  Server
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { maintenanceApi, type CreateMaintenanceRequest } from '@/api/maintenance-api'
import { useServiceStore } from '@/store/useServiceStore'

export default function ReviewService() {
  const navigate = useNavigate()
  const { currentOrder, resetOrder } = useServiceStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    // Get real user ID from localStorage
    const storedUser = localStorage.getItem('os_land_user')
    const user = storedUser ? JSON.parse(storedUser) : null
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'

    setIsSubmitting(true)
    try {
      // Map store data to API request format
      const payload: CreateMaintenanceRequest = {
        technicianId: userId,
        osNumber: currentOrder.osNumber,
        agency: currentOrder.agency,
        agencyName: currentOrder.agencyName,
        state: currentOrder.state,
        company: currentOrder.company,
        assetNumber: currentOrder.assetNumber,
        protocolType: currentOrder.protocolType,
        environmentName: currentOrder.environmentName,
        latitude: currentOrder.latitude,
        longitude: currentOrder.longitude,
        description: currentOrder.description,
        equipments: currentOrder.environments.map((env) => ({
          designatedSystem: env.designatedSystem,
          description: env.description,
          setPoint: env.setPoint,
          environmentPhotos: env.photos.map((p, idx) => ({
            label: p.label,
            file: p.file,
            fileKey: `temp_${idx}` // The API utility will re-generate unique keys
          }))
        }))
      };

      await maintenanceApi.create(payload);
      resetOrder();
      navigate('/service/complete');
    } catch (error) {
      console.error('Failed to create maintenance order:', error);
      alert('Ocorreu um erro ao enviar a ordem de serviço. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-10">
      {/* Page Header */}
      <div className="p-6">
        <h2 className="text-4xl font-bold text-primary">Revisão do Serviço</h2>
        <p className="font-black text-slate-500 mt-2 leading-relaxed">
          Verifique os detalhes abaixo antes do envio final da ordem de serviço.
        </p>
      </div>

      <div className="px-6 space-y-4">
        {/* General Info Section */}
        <Card className="rounded-3xl shadow-sm border-slate-100 overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center p-5 pb-2">
            <CardTitle className="text-lg font-bold text-slate-800">Informações Gerais</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/service/new', { state: { fromReview: true } })}
              className="w-8 h-8 bg-slate-50 rounded-full text-primary hover:bg-blue-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>

          <CardContent className="p-5 pt-2 grid gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número da OS</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.osNumber || 'N/A'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agência</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.agency || 'N/A'} {currentOrder.agencyName && `- ${currentOrder.agencyName}`}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nº de Bem</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.assetNumber || 'N/A'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UF</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.state?.toUpperCase() || 'N/A'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.protocolType === 'corrective' ? 'Corretiva' : 'Preventiva'}</p>
            </div>
            {currentOrder.environmentName && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambiente</p>
                <p className="text-sm font-bold text-slate-700">{currentOrder.environmentName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environments Section */}
        <Card className="rounded-3xl shadow-sm border-slate-100 overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center p-5 pb-2">
            <CardTitle className="text-lg font-bold text-slate-800">Ambientes</CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/service/environment/add')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-primary rounded-full text-[10px] font-bold hover:bg-blue-100 transition-colors h-7"
            >
              <Plus className="w-3 h-3" />
              Adicionar
            </Button>
          </CardHeader>

          <CardContent className="p-5 pt-2 space-y-4">
            {currentOrder.environments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">Nenhum ambiente adicionado.</p>
            ) : (
              currentOrder.environments.map((env) => (
                <EnvironmentItem
                  key={env.id}
                  name={env.designatedSystem}
                  details={`${env.photos.length} fotos capturadas`}
                  icon={env.designatedSystem === 'split' ? <Server className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  photos={env.photos.map(p => p.previewUrl)}
                  onEdit={() => navigate('/service/environment/add')}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Final Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleConfirm}
            disabled={currentOrder.environments.length === 0 || isSubmitting}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl gap-3 text-base font-bold disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
