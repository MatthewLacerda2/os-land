import { maintenanceApi, type MaintenanceItem } from '@/api/maintenance-api'
import OSItem from '@/components/pages/os-item'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function History() {
  const [services, setServices] = useState<MaintenanceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const response = await maintenanceApi.list(0, 50)
        setServices(response.items)
      } catch (err: any) {
        setError('Erro ao carregar o histórico. Tente novamente mais tarde.')
        console.error('Fetch history error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase">
            Landio Systems
          </h1>
        </div>
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <span className="text-[10px] font-bold">LY</span>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-6 w-full">
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold text-primary">Histórico de Serviços</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Registro completo de ordens de serviço executadas, documentação técnica e status de aprovação.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="w-8 h-8 text-primary" />
            <p className="text-sm text-slate-400 font-medium">Carregando histórico...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-red-50 rounded-3xl border border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-6 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 font-medium">Nenhuma ordem de serviço encontrada.</p>

          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {services.map((service) => (
              <OSItem
                key={service.id}
                number={service.osNumber}
                description={service.company || 'Manutenção Geral'}
                location={service.location}
                date={formatDate(service.createdAt)}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Link to="/service/new">
          <Button
            size="icon"
            className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all active:scale-90 z-40"
          >
            <Plus className="w-8 h-8 font-light" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
