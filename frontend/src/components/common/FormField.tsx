import { Label } from '@/components/ui/label'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor?: string
  /** Shows an "Opcional" marker aligned to the right of the label. */
  optional?: boolean
  children: ReactNode
  className?: string
}

export default function FormField({ label, htmlFor, optional, children, className }: FormFieldProps) {
  return (
    <div className={className ?? 'space-y-2'}>
      {optional ? (
        <div className="flex justify-between">
          <Label htmlFor={htmlFor}>{label}</Label>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Opcional</span>
        </div>
      ) : (
        <Label htmlFor={htmlFor}>{label}</Label>
      )}
      {children}
    </div>
  )
}
