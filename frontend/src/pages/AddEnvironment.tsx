import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useServiceStore } from '@/store/useServiceStore'
import {
  Camera,
  CheckCircle2,
  MapPin,
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
}

const PHOTO_TASKS: Record<SystemType, PhotoTask[]> = {
  'Split': [
    { id: 'evap', label: 'Evaporadora', description: 'Etiqueta Técnica', icon: <Waves className="w-5 h-5" /> },
    { id: 'cond', label: 'Condensadora', description: 'Etiqueta Técnica', icon: <Settings className="w-5 h-5" /> },
    { id: 'drain', label: 'Compressor', description: 'Níveis de amperagem e ruído', icon: <Wrench className="w-5 h-5" /> },
  ],
  'Self': [
    { id: 'fan', label: 'Etiqueta do Ventilador', description: 'Etiqueta Técnica do Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'fan', label: 'Módulo do Ventilador', description: 'Foto do Módulo do Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'coil', label: 'Etiqueta do Trocador', description: 'Etiqueta Técnica do Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'coil', label: 'Módulo do Trocador', description: 'Foto do Módulo do Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'comp1', label: 'Etique Técnica do Compressor 1', description: 'Etiqueta Técnica', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Etique Técnica do Compressor 2', description: 'Etiqueta Técnica', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etique Técnica do Compressor 3', description: 'Etiqueta Técnica', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Foto do Módulo Compressor 1', description: 'Foto do Módulo', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Foto do Módulo Compressor 2', description: 'Foto do Módulo', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Foto do Módulo Compressor 3', description: 'Foto do Módulo', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etiqueta do Módulo Condensador', description: 'Etiqueta Técnica do Condensador', icon: <Zap className="w-5 h-5" /> },
  ],
  'Splitão': [
    { id: 'fan', label: 'Etiqueta do Ventilador', description: 'Etiqueta Técnica do Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'fan', label: 'Módulo do Ventilador', description: 'Foto do Módulo do Ventilador', icon: <Zap className="w-5 h-5" /> },
    { id: 'coil', label: 'Etiqueta do Trocador', description: 'Etiqueta Técnica do Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'coil', label: 'Módulo do Trocador', description: 'Foto do Módulo do Trocador', icon: <Waves className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etiqueta do Módulo Condensador', description: 'Etiqueta Técnica do Condensador', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Etique Técnica do Compressor 1', description: 'Etiqueta Técnica', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Etique Técnica do Compressor 2', description: 'Etiqueta Técnica', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Etique Técnica do Compressor 3', description: 'Etiqueta Técnica', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp1', label: 'Foto do Módulo Compressor 1', description: 'Foto do Módulo', icon: <Settings className="w-5 h-5" /> },
    { id: 'comp2', label: 'Foto do Módulo Compressor 2', description: 'Foto do Módulo', icon: <Zap className="w-5 h-5" /> },
    { id: 'comp3', label: 'Foto do Módulo Compressor 3', description: 'Foto do Módulo', icon: <Zap className="w-5 h-5" /> },
  ],
}

export default function AddEnvironment() {
  const navigate = useNavigate()
  const { addEnvironment } = useServiceStore()

  const [envName, setEnvName] = useState('')
  const [system, setSystem] = useState<SystemType>('Split')
  const [faultDescription, setFaultDescription] = useState('')

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
    if (!envName) {
      alert('Por favor, insira o nome do local.')
      return
    }

    const requiredTasks = PHOTO_TASKS[system]
    const allPhotosCaptured = requiredTasks.every(task => !!taskFiles[task.id])

    // TODO: Re-enable photo validation for production
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
      name: envName,
      designatedSystem: system.toLowerCase().replace('ão', 'ao'),
      description: faultDescription || undefined,
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
        {/* Environment Identification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Identificação do Ambiente</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="envName" className="ml-1 text-slate-500">Nome do Ambiente</Label>
            <Input
              id="envName"
              value={envName}
              onChange={(e) => setEnvName(e.target.value)}
              placeholder="ex: Sala de Servidores A"
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
            />
          </div>
        </section>

        {/* Fault Description */}
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
