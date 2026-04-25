import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

interface OSItemProps {
  number: string
  description: string
  location: string
  date: string
}

export default function OSItem({ number, description, location, date }: OSItemProps) {
  return (
    <Link to="/service/view" className="block">
      <div className="bg-[#f8f9fa] rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col gap-5 transition-all hover:shadow-md active:scale-[0.98] cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Nº {number}
          </h3>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Agência / Local
          </p>
          <p className="text-sm font-medium text-gray-700">
            {location}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Data de Execução
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Calendar className="w-4 h-4 text-primary fill-blue-50" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}