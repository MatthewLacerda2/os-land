import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, Home, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Complete() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 text-center bg-white">
      {/* Success Animation Area */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-blue-50 rounded-full scale-150 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Serviço Concluído!</h2>
        <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
          A ordem de serviço foi registrada com sucesso e já está disponível no seu histórico.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-slate-200 text-slate-600 gap-2 font-bold"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-slate-200 text-slate-600 gap-2 font-bold"
          >
            <Share2 className="w-4 h-4" />
            Enviar
          </Button>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-xl gap-3 text-base font-bold"
        >
          <Home className="w-5 h-5" />
          Voltar para o Início
        </Button>
      </div>

    </div>
  )
}
