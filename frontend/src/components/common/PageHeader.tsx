import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** When set, renders a back-arrow button that navigates to this target. */
  back?: string | number
  className?: string
}

export default function PageHeader({ title, subtitle, back, className }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className={className ?? 'p-6 flex items-center gap-4 sticky top-0 bg-muted/80 backdrop-blur-md z-10'}>
      {back !== undefined && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            typeof back === 'number' ? navigate(back) : navigate(back)
          }
          className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground shadow-sm border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      <div>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {subtitle && (
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
