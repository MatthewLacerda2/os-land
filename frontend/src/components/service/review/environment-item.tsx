import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface EnvironmentItemProps {
  name: string;
  details: string;
  icon: React.ReactNode;
  photos: string[];
  onEdit: () => void;
}

export default function EnvironmentItem({
  name,
  details,
  icon,
  photos,
  onEdit,
}: EnvironmentItemProps) {
  return (
    <div className="space-y-3 p-4 rounded-2xl border border-border bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div className="grow">
          <h4 className="text-xs font-bold text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {details}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2 text-xs font-bold text-primary hover:bg-primary/10"
        >
          Editar
        </Button>
      </div>

      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((src, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-lg bg-card border border-border shrink-0 overflow-hidden"
          >
            <img
              src={src}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          </div>
        ))}
        {photos.length === 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs italic">
            <ImageIcon className="w-3 h-3" />
            Nenhuma foto
          </div>
        )}
      </div>
    </div>
  );
}
