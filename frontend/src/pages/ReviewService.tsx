import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Monitor,
  Pencil,
  Plus,
  Send,
  Server
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ReviewService() {
  const navigate = useNavigate()

  const handleConfirm = () => {
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
              <p className="text-sm font-bold text-slate-700">OS-2023-8842</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agência</p>
              <p className="text-sm font-bold text-slate-700">Central Bank - Branch 04</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UF</p>
              <p className="text-sm font-bold text-slate-700">SP</p>
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

          <CardContent className="p-5 pt-2 space-y-2">
            <EnvironmentItem
              name="Server Room A"
              details="2 Unidades HVAC"
              icon={<Server className="w-5 h-5" />}
              onEdit={() => navigate('/service/environment/add')}
            />
            <EnvironmentItem
              name="Main Lobby"
              details="1 Unidade Central"
              icon={<Building2 className="w-5 h-5" />}
              onEdit={() => navigate('/service/environment/add')}
            />
            <EnvironmentItem
              name="Manager Office"
              details="1 Unidade Split"
              icon={<Monitor className="w-5 h-5" />}
              onEdit={() => navigate('/service/environment/add')}
            />
          </CardContent>
        </Card>

        {/* Final Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleConfirm}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl gap-3 text-base font-bold"
          >
            <Send className="w-5 h-5" />
            Confirmar e Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

function EnvironmentItem({ name, details, icon, onEdit }: { name: string; details: string; icon: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-2xl border border-slate-50 bg-slate-50/50">
      <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="grow">
        <h4 className="text-xs font-bold text-slate-800">{name}</h4>
        <p className="text-[9px] text-slate-500 font-medium">{details}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="h-7 px-2 py-1 bg-white border-slate-100 rounded-lg shadow-sm text-[9px] font-bold text-slate-400 uppercase tracking-wider hover:text-primary transition-colors"
      >
        Editar
      </Button>
    </div>
  )
}
