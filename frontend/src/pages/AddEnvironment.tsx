import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useServiceStore } from '@/store/useServiceStore'
import {
  Camera,
  CheckCircle2,
  Settings,
  Waves,
  Wrench,
  Zap
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SystemType = 'Split' | 'Self' | 'Splitão'

interface PhotoTask {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  preventiveOnly?: boolean
}

const PHOTO_TASKS: Record<SystemType, PhotoTask[]> = {
  'Split': [
    { id: 'evap_tec', label: 'Foto da Etiqueta Técnica da Evaporadora', description: 'Etiqueta Técnica', icon: <Waves className="w-5 h-5" /> },
    { id: 'evap', label: 'Foto da Evaporadora', description: 'Evaporadora', icon: <Waves className="w-5 h-5" /> },
    { id: 'cond_tec', label: 'Foto da Etiqueta Técnica da Condensadora', description: 'Etiqueta Técnica', icon: <Settings className="w-5 h-5" /> },
    { id: 'cond', label: 'Foto da Condensadora', description: 'Condensadora', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp_tec', label: 'Foto da Etiqueta do Compressor', description: 'Etiqueta do Compressor', icon: <Wrench className="w-5 h-5" /> },
    { id: 'compressor', label: 'Foto do Compressor', description: 'Compressor', icon: <Wrench className="w-5 h-5" /> },
    { id: 'temp_in', label: 'Temperatura de Entrada', description: 'Medição da temperatura de entrada', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'temp_out', label: 'Temperatura de Saída', description: 'Medição da temperatura de saída', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'press_high', label: 'Pressão de Alta', description: 'Medição da pressão de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'press_low', label: 'Pressão de Baixa', description: 'Medição da pressão de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'temp_in', label: 'Temperatura de Alta', description: 'Medição da temperatura de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'temp_out', label: 'Temperatura de Baixa', description: 'Medição da temperatura de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'amp', label: 'Amperagem', description: 'Medição da amperagem', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },

  ],
  'Self': [
    { id: 'et_fan', label: 'Etiqueta Técnica do Módulo Ventilador', description: 'Etiqueta Técnica do Módulo Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'fan', label: 'Foto do Módulo Ventilador', description: 'Foto do Módulo Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'et_coil', label: 'Etiqueta Técnica do Módulo Trocador', description: 'Etiqueta Técnica do Módulo Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'coil', label: 'Foto do Módulo Trocador', description: 'Foto do Módulo Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'et_comp1', label: 'Etiqueta Técnica do Compressor 1', description: 'Etiqueta Técnica 1', icon: <Settings className="w-5 h-5" /> },
    { id: 'et_comp2', label: 'Etiqueta Técnica do Compressor 2', description: 'Etiqueta Técnica 2', icon: <Zap className="w-5 h-5" /> },
    { id: 'et_comp3', label: 'Etiqueta Técnica do Compressor 3', description: 'Etiqueta Técnica 3', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Foto do Compressor 1', description: 'Foto do Compressor 1', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Foto do Compressor 2', description: 'Foto do Compressor 2', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Foto do Compressor 3', description: 'Foto do Compressor 3', icon: <Zap className="w-5 h-5" /> },
    { id: 'et_cond', label: 'Etiqueta do Módulo Condensador', description: 'Etiqueta Técnica do Módulo Condensador', icon: <Zap className="w-5 h-5" /> },
    { id: 'cond', label: 'Foto do Módulo Condensador', description: 'Foto do Módulo Condensador', icon: <Zap className="w-5 h-5" /> },
    { id: 'air_flow', label: 'Vazão de ar de saída no Módulo Ventilador', description: 'Medição da vazão de ar de saída no Módulo Ventilador', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Foto do filtro de ar do Módulo Trocador', description: 'Foto do filtro de ar', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Temperatura de Alta', description: 'Medição da temperatura de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Temperatura de Baixa', description: 'Medição da temperatura de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Pressão de Alta', description: 'Medição da pressão de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Pressão de Baixa', description: 'Medição da pressão de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Amperagem', description: 'Medição da amperagem', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Módulo Trocador', description: 'Módulo trocador', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Foto do Termostato', description: 'Foto do Termostato', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
  ],
  'Splitão': [
    { id: 'fan', label: 'Etiqueta Técnica do Módulo Ventilador', description: 'Etiqueta Técnica do Módulo Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'fan', label: 'Foto do Módulo Ventilador', description: 'Foto do Módulo Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'coil', label: 'Etiqueta Técnica do Módulo Trocador', description: 'Etiqueta Técnica do Módulo Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'coil', label: 'Foto do Módulo do Trocador', description: 'Foto do Módulo do Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etiqueta Técnica do Módulo Condensador', description: 'Etiqueta Técnica do Módulo Condensador', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Foto do Módulo Condensador', description: 'Foto do Módulo Condensador', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Etique Técnica do Compressor 1', description: 'Etiqueta Técnica do Compressor 1', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Etique Técnica do Compressor 2', description: 'Etiqueta Técnica do Compressor 2', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etique Técnica do Compressor 3', description: 'Etiqueta Técnica do Compressor 3', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Foto do Módulo Compressor 1', description: 'Foto do Módulo Compressor 1', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Foto do Módulo Compressor 2', description: 'Foto do Módulo Compressor 2', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Foto do Módulo Compressor 3', description: 'Foto do Módulo Compressor 3', icon: <Zap className="w-5 h-5" /> },
    { id: 'air_flow', label: 'Vazão de ar de saída no Módulo Ventilador', description: 'Medição da vazão de ar de saída no Módulo Ventilador', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Foto do filtro de ar do Módulo Trocador', description: 'Foto do filtro de ar', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Temperatura de Alta', description: 'Medição da temperatura de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Temperatura de Baixa', description: 'Medição da temperatura de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Pressão de Alta', description: 'Medição da pressão de alta', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Pressão de Baixa', description: 'Medição da pressão de baixa', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Amperagem', description: 'Medição da amperagem', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
    { id: 'air_flow', label: 'Foto do Termostato', description: 'Foto do Termostato', icon: <Wrench className="w-5 h-5" />, preventiveOnly: true },
  ],
}

export default function AddEnvironment() {
  const navigate = useNavigate()
  const { currentOrder, addEnvironment } = useServiceStore()
  const protocolType = currentOrder.protocolType

  const [system, setSystem] = useState<SystemType>('Split')
  const [faultDescription, setFaultDescription] = useState('')
  const [setPoint, setSetPoint] = useState<string>('')

  const [taskFiles, setTaskFiles] = useState<Record<string, File>>({})
  const [taskPreviews, setTaskPreviews] = useState<Record<string, string>>({})

  const handleFileSelect = (taskId: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setTaskFiles(prev => ({ ...prev, [taskId]: file }))
      setTaskPreviews(prev => ({ ...prev, [taskId]: url }))
    }
  }

  const triggerFilePicker = (taskId: string) => {
    const input = document.getElementById(`file-${taskId}`) as HTMLInputElement
    input?.click()
  }

  const handleSave = () => {
    const requiredTasks = PHOTO_TASKS[system]
    const allPhotosCaptured = requiredTasks.every(task => !!taskFiles[task.id])

    //TODO: Re-enable photo validation for production
    // if (!allPhotosCaptured) {
    //   alert(`Por favor, capture fotos de TODOS os componentes do sistema ${system}.`)
    //   return
    // }

    const photos = Object.entries(taskFiles).map(([taskId, file]) => ({
      label: PHOTO_TASKS[system].find(t => t.id === taskId)?.label || taskId,
      file,
      previewUrl: taskPreviews[taskId]
    }))

    addEnvironment({
      designatedSystem: system.toLowerCase().replace('ão', 'ao'),
      description: faultDescription || undefined,
      setPoint: setPoint !== '' ? parseFloat(setPoint) : undefined,
      photos
    })

    navigate('/service/review')
  }

  return (
    <div className="flex flex-col min-h-full bg-white pb-10">
      {/* Header Context */}
      <div className="p-6 space-y-4">
        <h2 className="text-4xl font-bold text-primary">Detalhes do Equipamento</h2>
      </div>

      <div className="px-6 space-y-10">
        {/* Fault Description — only for corrective maintenance */}
        {protocolType !== 'preventive' && (
          <section className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              Falha Detectada
            </h3>
            <Textarea
              id="faultDescription"
              className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
              placeholder="Descreva a falha detectada, sintomas e observações visuais deste ambiente..."
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
            />
          </section>
        )}

        {/* Set Point */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Set Point
          </h3>
          <div className="relative">
            <Input
              id="setPoint"
              type="number"
              inputMode="decimal"
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary pr-12"
              placeholder="ex: 23"
              value={setPoint}
              onChange={(e) => setSetPoint(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">°C</span>
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
                  setTaskFiles({})
                }}
                className={`px-6 h-10 rounded-xl text-sm font-bold transition-all ${system === type
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
            {PHOTO_TASKS[system]
              .filter(task => !task.preventiveOnly || protocolType === 'preventive')
              .map((task) => {
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
                      className={`group rounded-2xl p-4 flex items-center gap-4 border-2 transition-all cursor-pointer shadow-sm ${previewUrl ? 'border-primary bg-blue-50/30' : 'border-transparent bg-slate-50 hover:border-slate-200'
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
