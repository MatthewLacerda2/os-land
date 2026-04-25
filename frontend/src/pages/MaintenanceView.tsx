import { Button } from '@/components/ui/button'
import {
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Monitor,
  Server,
  Waves,
  Wrench,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MaintenanceView() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-10">
      {/* Page Header */}
      <div className="p-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Detalhes da Manutenção</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">OS-2023-8842</p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* General Info Section (Read Only) */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informações Gerais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</p>
              <p className="text-sm font-bold text-slate-700">Agência Central - 0192</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data/Hora</p>
              <p className="text-sm font-bold text-slate-700">14 Out 2023, 08:30</p>
            </div>
          </div>
        </section>

        {/* Detailed Environments List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider px-1">Relatório de Ambientes</h3>

          <MaintenanceDetailCard
            name="Server Room A"
            system="Split"
            protocol="Preventiva"
            icon={<Server className="w-5 h-5" />}
          />

          <MaintenanceDetailCard
            name="Main Lobby"
            system="Self-Contained"
            protocol="Corretiva"
            icon={<Building2 className="w-5 h-5" />}
          />

          <MaintenanceDetailCard
            name="Manager Office"
            system="Splitão"
            protocol="Preventiva"
            icon={<Monitor className="w-5 h-5" />}
          />
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

function MaintenanceDetailCard({ name, system, protocol, icon }: { name: string; system: string; protocol: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-5">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md">
          {icon}
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-800">{name}</h4>
          <div className="flex gap-2 mt-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md italic">
              {system}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md italic ${protocol === 'Preventiva' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
              {protocol}
            </span>
          </div>
        </div>
      </div>

      {/* Photo Grid Placeholders */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Camera className="w-3 h-3" />
          Evidências Fotográficas
        </p>
        <div className="grid grid-cols-4 gap-2">
          <PhotoMiniPlaceholder icon={<Waves className="w-3 h-3" />} />
          <PhotoMiniPlaceholder icon={<Wrench className="w-3 h-3" />} />
          <PhotoMiniPlaceholder icon={<Zap className="w-3 h-3" />} />
          <PhotoMiniPlaceholder icon={<CheckCircle2 className="w-3 h-3" />} />
        </div>
      </div>
    </div>
  )
}

function PhotoMiniPlaceholder({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300">
      {icon}
    </div>
  )
}
