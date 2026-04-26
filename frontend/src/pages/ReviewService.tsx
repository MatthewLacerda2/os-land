import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Pencil,
  Plus,
  Send,
  Server
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useServiceStore } from '@/store/useServiceStore'
import {
  Image as ImageIcon
} from 'lucide-react'

export default function ReviewService() {
  const navigate = useNavigate()
  const { currentOrder } = useServiceStore()

  const handleConfirm = () => {
    console.log('Final Order Data:', currentOrder)
    navigate('/service/complete')
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
              onClick={() => navigate('/service/new')}
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
              <p className="text-sm font-bold text-slate-700">{currentOrder.agency || 'N/A'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UF</p>
              <p className="text-sm font-bold text-slate-700">{currentOrder.state?.toUpperCase() || 'N/A'}</p>
            </div>
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
                  name={env.name}
                  details={`${env.photos.length} fotos capturadas • ${env.protocolType === 'corrective' ? 'Corretiva' : 'Preventiva'}`}
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
            disabled={currentOrder.environments.length === 0}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl gap-3 text-base font-bold disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            Confirmar e Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

interface EnvironmentItemProps {
  name: string;
  details: string;
  icon: React.ReactNode;
  photos: string[];
  onEdit: () => void;
}

function EnvironmentItem({ name, details, icon, photos, onEdit }: EnvironmentItemProps) {
  return (
    <div className="space-y-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div className="grow">
          <h4 className="text-xs font-bold text-slate-800">{name}</h4>
          <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{details}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2 text-[10px] font-bold text-primary hover:bg-blue-50"
        >
          Editar
        </Button>
      </div>

      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((src, i) => (
          <div key={i} className="w-12 h-12 rounded-lg bg-white border border-slate-200 shrink-0 overflow-hidden">
            <img src={src} className="w-full h-full object-cover" alt="Preview" />
          </div>
        ))}
        {photos.length === 0 && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[9px] italic">
            <ImageIcon className="w-3 h-3" />
            Nenhuma foto
          </div>
        )}
      </div>
    </div>
  )
}
