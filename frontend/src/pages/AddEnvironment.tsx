import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Settings,
  Waves,
  Wrench,
  Zap,
  MapPin
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SystemType = 'Split' | 'Self' | 'Splitão'
type ProtocolType = 'Corretiva' | 'Preventiva'

interface PhotoTask {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

const PHOTO_TASKS: Record<SystemType, PhotoTask[]> = {
  'Split': [
    { id: 'evap', label: 'Evaporadora', description: 'Limpeza da unidade interna e aletas', icon: <Waves className="w-5 h-5" /> },
    { id: 'cond', label: 'Condensadora', description: 'Troca de calor da unidade externa', icon: <Settings className="w-5 h-5" /> },
    { id: 'drain', label: 'Bandeja de Dreno', description: 'Verificação de obstrução e higiene', icon: <Wrench className="w-5 h-5" /> },
    { id: 'filter', label: 'Tela do Filtro', description: 'Saturação e integridade', icon: <ClipboardCheck className="w-5 h-5" /> },
  ],
  'Self': [
    { id: 'fan', label: 'Ventilador Principal', description: 'Alinhamento de rolamentos e correias', icon: <Zap className="w-5 h-5" /> },
    { id: 'coil', label: 'Serpentina de Refrigeração', description: 'Verificação de pressão e temperatura', icon: <Waves className="w-5 h-5" /> },
    { id: 'comp', label: 'Compressor', description: 'Níveis de amperagem e ruído', icon: <Settings className="w-5 h-5" /> },
    { id: 'elec', label: 'Placa de Comando', description: 'Verificação de aperto dos terminais', icon: <Zap className="w-5 h-5" /> },
  ],
  'Splitão': [
    { id: 'l-coil', label: 'Serpentina Industrial', description: 'Limpeza de aletas em escala industrial', icon: <Waves className="w-5 h-5" /> },
    { id: 'multi-c', label: 'Multi-Compressores', description: 'Verificação de estágio e sequência', icon: <Settings className="w-5 h-5" /> },
    { id: 'e-fan', label: 'Ventilador de Alto Fluxo', description: 'Saída de CFM e vibração', icon: <Zap className="w-5 h-5" /> },
    { id: 'board', label: 'Lógica Principal', description: 'Status de calibração dos sensores', icon: <ClipboardCheck className="w-5 h-5" /> },
  ]
}

export default function AddEnvironment() {
  const navigate = useNavigate()
  const [envName, setEnvName] = useState('')
  const [protocol, setProtocol] = useState<ProtocolType>('Corretiva')
  const [system, setSystem] = useState<SystemType>('Split')
  const [taskPreviews, setTaskPreviews] = useState<Record<string, string>>({})

  const handleFileSelect = (taskId: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setTaskPreviews(prev => ({ ...prev, [taskId]: url }))
    }
  }

  const triggerFilePicker = (taskId: string) => {
    const input = document.getElementById(`file-${taskId}`) as HTMLInputElement
    input?.click()
  }

  const handleSave = () => {
    navigate('/service/review')
  }

  return (
    <div className="flex flex-col min-h-full bg-white pb-10">
      {/* Header Context */}
      <div className="p-6 space-y-4">
        <h2 className="text-4xl font-bold text-primary">Detalhes do Equipamento</h2>
      </div>

      <div className="px-6 space-y-10">
        {/* Environment Identification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Identificação do Ambiente</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="envName" className="ml-1 text-slate-500">Nome do Local / Sala</Label>
            <Input
              id="envName"
              value={envName}
              onChange={(e) => setEnvName(e.target.value)}
              placeholder="ex: Sala de Servidores A"
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
            />
          </div>
        </section>

        {/* Maintenance Protocol Toggle */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Protocolo de Manutenção
          </h3>
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
            <Button
              variant={protocol === 'Corretiva' ? 'default' : 'ghost'}
              onClick={() => setProtocol('Corretiva')}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${
                protocol === 'Corretiva' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Corretiva
            </Button>
            <Button
              variant={protocol === 'Preventiva' ? 'default' : 'ghost'}
              onClick={() => setProtocol('Preventiva')}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${
                protocol === 'Preventiva' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Preventiva
            </Button>
          </div>
        </section>

        {/* System Designation Chips */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Designação do Sistema
          </h3>
          <div className="flex flex-wrap gap-2">
            {(['Split', 'Self', 'Splitão'] as SystemType[]).map((type) => (
              <Button
                key={type}
                variant={system === type ? 'default' : 'secondary'}
                onClick={() => {
                  setSystem(type)
                  setTaskPreviews({})
                }}
                className={`px-6 h-10 rounded-xl text-sm font-bold transition-all ${
                  system === type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </section>

        {/* Component Verification List */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Verificação de Componentes
          </h3>

          <div className="space-y-3">
            {PHOTO_TASKS[system].map((task) => {
              const previewUrl = taskPreviews[task.id]
              return (
                <div key={task.id}>
                  <input
                    type="file"
                    id={`file-${task.id}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(task.id, e.target.files?.[0] || null)}
                  />
                  <Card
                    onClick={() => triggerFilePicker(task.id)}
                    className={`group rounded-2xl p-4 flex items-center gap-4 border-2 transition-all cursor-pointer shadow-sm ${
                      previewUrl ? 'border-primary bg-blue-50/30' : 'border-transparent bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      {task.icon}
                    </div>
                    <div className="grow">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{task.label}</h4>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{task.description}</p>
                    </div>
                    <div className={`w-12 h-12 flex items-center justify-center transition-all overflow-hidden ${
                      previewUrl ? 'border-2 border-primary shadow-md' : 'bg-slate-100 text-slate-300 rounded-full'
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
            })}
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl gap-3 text-base font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Salvar Ambiente
          </Button>
        </div>
      </div>
    </div>
  )
}
