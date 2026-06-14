import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface OSItemProps {
  id: string
  number: string
  description: string
  location: string
  date: string
}

export default function OSItem({ id, number, description, location, date }: OSItemProps) {
  return (
    <Link to={`/service/view/${id}`} className="block">
      <Card className="rounded-2xl p-6 shadow-sm border-slate-100 bg-[#f8f9fa] flex flex-col gap-5 transition-all hover:shadow-md hover:border-slate-200 active:scale-[0.98] cursor-pointer group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Nº {number}
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Agência / Local
            </p>
            <p className="text-sm font-medium text-slate-700">
              {location}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Data de Execução
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Calendar className="w-4 h-4 text-primary fill-blue-50" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}