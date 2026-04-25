import { Button } from '@/components/ui/button'
import {
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Settings,
  Waves,
  Wrench,
  Zap
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
        {/* Maintenance Protocol Toggle */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Protocolo de Manutenção
          </h3>
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => setProtocol('Corretiva')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${protocol === 'Corretiva' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
                }`}
            >
              <Wrench className="w-4 h-4" />
              Corretiva
            </button>
            <button
              onClick={() => setProtocol('Preventiva')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${protocol === 'Preventiva' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
                }`}
            >
              <Calendar className="w-4 h-4" />
              Preventiva
            </button>
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
              <button
                key={type}
                onClick={() => {
                  setSystem(type)
                  setTaskPreviews({})
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${system === type
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
              >
                {type}
              </button>
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
                  <div
                    onClick={() => triggerFilePicker(task.id)}
                    className={`group bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border-2 transition-all cursor-pointer ${previewUrl ? 'border-primary bg-blue-50/30 shadow-sm' : 'border-transparent hover:border-slate-200'
                      }`}
                  >
                    <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      {task.icon}
                    </div>
                    <div className="grow">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{task.label}</h4>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{task.description}</p>
                    </div>
                    <div className={`w-12 h-12 flex items-center justify-center transition-all overflow-hidden ${previewUrl ? 'border-2 border-primary shadow-md' : 'bg-slate-100 text-slate-300 rounded-full'
                      }`}>
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-xl gap-3 text-base font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Salvar Ambiente
          </Button>
        </div>
      </div>
    </div>
  )
}
