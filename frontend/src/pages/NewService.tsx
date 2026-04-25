import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useServiceStore } from '@/store/useServiceStore'
import { Camera, ChevronRight, ClipboardList, Info, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BRAZIL_STATES = [
  { value: 'ac', label: 'Acre (AC)' },
  { value: 'al', label: 'Alagoas (AL)' },
  { value: 'ap', label: 'Amapá (AP)' },
  { value: 'am', label: 'Amazonas (AM)' },
  { value: 'ba', label: 'Bahia (BA)' },
  { value: 'ce', label: 'Ceará (CE)' },
  { value: 'df', label: 'Distrito Federal (DF)' },
  { value: 'es', label: 'Espírito Santo (ES)' },
  { value: 'go', label: 'Goiás (GO)' },
  { value: 'ma', label: 'Maranhão (MA)' },
  { value: 'mt', label: 'Mato Grosso (MT)' },
  { value: 'ms', label: 'Mato Grosso do Sul (MS)' },
  { value: 'mg', label: 'Minas Gerais (MG)' },
  { value: 'pa', label: 'Pará (PA)' },
  { value: 'pb', label: 'Paraíba (PB)' },
  { value: 'pr', label: 'Paraná (PR)' },
  { value: 'pe', label: 'Pernambuco (PE)' },
  { value: 'pi', label: 'Piauí (PI)' },
  { value: 'rj', label: 'Rio de Janeiro (RJ)' },
  { value: 'rn', label: 'Rio Grande do Norte (RN)' },
  { value: 'rs', label: 'Rio Grande do Sul (RS)' },
  { value: 'ro', label: 'Rondônia (RO)' },
  { value: 'rr', label: 'Roraima (RR)' },
  { value: 'sc', label: 'Santa Catarina (SC)' },
  { value: 'sp', label: 'São Paulo (SP)' },
  { value: 'se', label: 'Sergipe (SE)' },
  { value: 'to', label: 'Tocantins (TO)' },
]

export default function NewService() {
  const navigate = useNavigate()
  const { currentOrder, updateOrderDetails, startNewOrder } = useServiceStore()
  const [previews, setPreviews] = useState<Record<string, string>>({})

  // Initialize order if not exists
  if (!currentOrder) {
    startNewOrder()
  }

  const handleFileSelect = (slot: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviews(prev => ({ ...prev, [slot]: url }))
    }
  }

  const handleNext = () => {
    navigate('/service/environment/add')
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="p-6 pb-2">
        <h2 className="text-3xl font-bold text-primary">Informações Básicas e Fotos</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Capture os detalhes iniciais e imagens de diagnóstico para estabelecer a base do serviço.
        </p>
      </div>

      <div className="p-6 space-y-10">
        {/* Service Identification Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <ClipboardList className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Identificação do Serviço</h3>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="osNumber">Número da OS</Label>
              <input
                id="osNumber"
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="ex: OS-2023-8912"
                value={currentOrder?.number || ''}
                onChange={(e) => updateOrderDetails({ number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyCode">Código da Agência</Label>
              <input
                id="agencyCode"
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="ID da Agência"
                value={currentOrder?.location || ''}
                onChange={(e) => updateOrderDetails({ location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado/UF</Label>
              <Select>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecionar Região" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZIL_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="company">Empresa</Label>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Opcional</span>
              </div>
              <input
                id="company"
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Contratante / Cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Falha</Label>
              <Textarea
                id="description"
                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200"
                placeholder="Descreva a falha detectada, sintomas e quaisquer observações visuais imediatas..."
                value={currentOrder?.description || ''}
                onChange={(e) => updateOrderDetails({ description: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Initial Photos Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Camera className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Fotos Iniciais</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Capture os quatro ângulos obrigatórios para estabelecer a condição do equipamento antes do serviço.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <PhotoPlaceholder
              id="frontal"
              label="Vista Frontal"
              icon={<Camera className="w-6 h-6" />}
              preview={previews.frontal}
              onSelect={(file) => handleFileSelect('frontal', file)}
            />
            <PhotoPlaceholder
              id="label"
              label="Dados da Etiqueta"
              icon={<ClipboardList className="w-6 h-6" />}
              preview={previews.label}
              onSelect={(file) => handleFileSelect('label', file)}
            />
            <PhotoPlaceholder
              id="condenser"
              label="Condensadora"
              icon={<MapPin className="w-6 h-6" />}
              preview={previews.condenser}
              onSelect={(file) => handleFileSelect('condenser', file)}
            />
            <PhotoPlaceholder
              id="fault"
              label="Falha Detectada"
              icon={<Info className="w-6 h-6" />}
              preview={previews.fault}
              onSelect={(file) => handleFileSelect('fault', file)}
            />
          </div>
        </section>

        {/* Next Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleNext}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-lg gap-2 text-base font-bold"
          >
            Próximo
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PhotoPlaceholderProps {
  id: string
  label: string
  icon: React.ReactNode
  preview?: string
  onSelect: (file: File | null) => void
}

function PhotoPlaceholder({ id, label, icon, preview, onSelect }: PhotoPlaceholderProps) {
  const triggerFilePicker = () => {
    document.getElementById(`file-${id}`)?.click()
  }

  return (
    <div
      onClick={triggerFilePicker}
      className={`aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden relative group ${preview ? 'border-primary shadow-md' : 'border-dashed border-slate-200 bg-slate-50 hover:border-primary text-slate-400 hover:text-primary'
        }`}
    >
      <input
        type="file"
        id={`file-${id}`}
        className="hidden"
        accept="image/*"
        onChange={(e) => onSelect(e.target.files?.[0] || null)}
      />

      {preview ? (
        <img src={preview} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
      )}

      {/* Overlay on hover if preview exists */}
      {preview && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="w-8 h-8 text-white" />
        </div>
      )}
    </div>
  )
}
