import OSItem from '@/components/pages/os-item'

export default function History() {
  const mockServices = [
    {
      number: 'OS-24-0891A',
      description: 'MANUTENÇÃO PREVENTIVA',
      location: 'Ag. Central Bandeirantes (0192)',
      date: '14 Out 2023, 08:30'
    },
    {
      number: 'OS-24-0885C',
      description: 'REPARO CORRETIVO - CHILLER',
      location: 'Edifício Sede Administrativa',
      date: '12 Out 2023, 14:15'
    },
    {
      number: 'OS-24-0870B',
      description: 'INSPEÇÃO DE ROTINA',
      location: 'Ag. Vila Nova (0441)',
      date: '05 Out 2023, 09:00'
    }
  ]

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

      <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-bold text-primary">Histórico de Serviços</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Registro completo de ordens de serviço executadas, documentação técnica e status de aprovação.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {mockServices.map((service) => (
          <OSItem key={service.number} {...service} />
        ))}
      </div>
      
      {/* Floating Action Button */}
      <a 
        href="/service/new" 
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all active:scale-90 z-40"
      >
        <span className="text-3xl font-light">+</span>
      </a>
      </div>
    </div>
  )
}
