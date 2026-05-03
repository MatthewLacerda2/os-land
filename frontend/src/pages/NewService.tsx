import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useServiceStore } from '@/store/useServiceStore'
import { Calendar, ChevronRight, ClipboardList, MapPin, Wrench } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

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
  const location = useLocation()
  const { currentOrder, updateOrderDetails } = useServiceStore()

  const isEditing = location.state?.fromReview

  const handleNext = () => {
    if (isEditing) {
      navigate('/service/review')
    } else {
      navigate('/service/environment/add')
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="p-6 pb-2">
        <h2 className="text-3xl font-bold text-primary">Informações Básicas</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Preencha os detalhes iniciais para estabelecer a base do serviço.
        </p>
      </div>

      <div className="p-6 space-y-10">
        {/* Service Identification Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <ClipboardList className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-xs">Identificação do Serviço</h3>
          </div>

          <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="grid gap-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="osNumber">Número da OS</Label>
                <Input
                  id="osNumber"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="ex: OS-2023-8912"
                  value={currentOrder.osNumber}
                  onChange={(e) => updateOrderDetails({ osNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencyCode">Prefixo da Agência</Label>
                <Input
                  id="agencyCode"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="ID da Agência"
                  value={currentOrder.agency}
                  onChange={(e) => updateOrderDetails({ agency: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="agencyName">Nome da Agência</Label>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Opcional</span>
                </div>
                <Input
                  id="agencyName"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="Nome da Unidade"
                  value={currentOrder.agencyName}
                  onChange={(e) => updateOrderDetails({ agencyName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Estado/UF</Label>
                <Select
                  value={currentOrder.state}
                  onValueChange={(val) => updateOrderDetails({ state: val })}
                >
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
                <Input
                  id="company"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="Contratante / Cliente"
                  value={currentOrder.company}
                  onChange={(e) => updateOrderDetails({ company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="assetNumber">Nº de bem</Label>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Opcional</span>
                </div>
                <Input
                  id="assetNumber"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="Número de patrimônio"
                  value={currentOrder.assetNumber}
                  onChange={(e) => updateOrderDetails({ assetNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environmentName">Nome do Ambiente</Label>
                <Input
                  id="environmentName"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  placeholder="ex: Sala de Servidores A"
                  value={currentOrder.environmentName}
                  onChange={(e) => updateOrderDetails({ environmentName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Protocolo de Manutenção</Label>
                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                  <Button
                    type="button"
                    variant={currentOrder.protocolType === 'corrective' ? 'default' : 'ghost'}
                    onClick={() => updateOrderDetails({ protocolType: 'corrective' })}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${currentOrder.protocolType === 'corrective' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    <Wrench className="w-4 h-4" />
                    Corretiva
                  </Button>
                  <Button
                    type="button"
                    variant={currentOrder.protocolType === 'preventive' ? 'default' : 'ghost'}
                    onClick={() => updateOrderDetails({ protocolType: 'preventive' })}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all ${currentOrder.protocolType === 'preventive' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Preventiva
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Next Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleNext}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg gap-2 text-base font-bold"
          >
            Próximo
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
