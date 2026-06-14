import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServiceStore } from "@/store/useServiceStore";
import { Camera, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHOTO_TASKS, type SystemType } from "@/pages/add-environment-tasks";

export default function AddEnvironment() {
  const navigate = useNavigate();
  const { currentOrder, addEnvironment } = useServiceStore();
  const protocolType = currentOrder.protocolType;

  const [system, setSystem] = useState<SystemType>("Split");
  const [faultDescription, setFaultDescription] = useState("");
  const [setPoint, setSetPoint] = useState<string>("");

  const [taskFiles, setTaskFiles] = useState<Record<string, File>>({});
  const [taskPreviews, setTaskPreviews] = useState<Record<string, string>>({});

  const handleFileSelect = (taskId: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setTaskFiles((prev) => ({ ...prev, [taskId]: file }));
      setTaskPreviews((prev) => ({ ...prev, [taskId]: url }));
    }
  };

  const triggerFilePicker = (taskId: string) => {
    const input = document.getElementById(`file-${taskId}`) as HTMLInputElement;
    input?.click();
  };

  const handleSave = () => {
    const requiredTasks = PHOTO_TASKS[system];
    const allPhotosCaptured = requiredTasks.every(
      (task) => !!taskFiles[task.id],
    );

    if (!allPhotosCaptured) {
      alert(
        `Por favor, capture fotos de TODOS os componentes do sistema ${system}.`,
      );
      return;
    }

    const photos = Object.entries(taskFiles).map(([taskId, file]) => ({
      label: PHOTO_TASKS[system].find((t) => t.id === taskId)?.label || taskId,
      file,
      previewUrl: taskPreviews[taskId],
    }));

    addEnvironment({
      designatedSystem: system.toLowerCase().replace("ão", "ao"),
      description: faultDescription || undefined,
      setPoint: setPoint !== "" ? parseFloat(setPoint) : undefined,
      photos,
    });

    navigate("/service/review");
  };

  return (
    <div className="flex flex-col min-h-full bg-card pb-10">
      {/* Header Context */}
      <div className="p-6 space-y-4">
        <h2 className="text-4xl font-bold text-primary">
          Detalhes do Equipamento
        </h2>
      </div>

      <div className="px-6 space-y-10">
        {/* Fault Description — only for corrective maintenance */}
        {protocolType !== "preventive" && (
          <section className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              Falha Detectada
            </h3>
            <Textarea
              id="faultDescription"
              className="min-h-[100px] rounded-xl bg-muted border-border focus-visible:ring-primary"
              placeholder="Descreva a falha detectada, sintomas e observações visuais deste ambiente..."
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
            />
          </section>
        )}

        {/* Set Point */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Set Point
          </h3>
          <div className="relative">
            <Input
              id="setPoint"
              type="number"
              inputMode="decimal"
              className="h-12 rounded-xl bg-muted border-border focus-visible:ring-primary pr-12"
              placeholder="ex: 23"
              value={setPoint}
              onChange={(e) => setSetPoint(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
              °C
            </span>
          </div>
        </section>

        {/* System Designation Chips */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Designação do Sistema
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["Split", "Self", "Splitão"] as SystemType[]).map((type) => (
              <Button
                key={type}
                variant={system === type ? "default" : "secondary"}
                onClick={() => {
                  setSystem(type);
                  setTaskPreviews({});
                  setTaskFiles({});
                }}
                className={`px-6 h-10 rounded-xl text-sm font-bold transition-all ${
                  system === type
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </section>

        {/* Component Verification List */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Verificação de Componentes
          </h3>

          <div className="space-y-3">
            {PHOTO_TASKS[system]
              .filter(
                (task) => !task.preventiveOnly || protocolType === "preventive",
              )
              .map((task) => {
                const previewUrl = taskPreviews[task.id];
                return (
                  <div key={task.id}>
                    <Input
                      type="file"
                      id={`file-${task.id}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileSelect(task.id, e.target.files?.[0] || null)
                      }
                    />
                    <Card
                      onClick={() => triggerFilePicker(task.id)}
                      className={`group rounded-2xl p-4 flex items-center gap-4 border-2 transition-all cursor-pointer shadow-sm ${
                        previewUrl
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-muted hover:border-border"
                      }`}
                    >
                      <div className="w-12 h-12 bg-card text-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        {task.icon}
                      </div>
                      <div className="grow">
                        <h4 className="text-sm font-bold text-foreground tracking-tight">
                          {task.label}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {task.description}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 flex items-center justify-center transition-all overflow-hidden ${
                          previewUrl
                            ? "border-2 border-primary shadow-md"
                            : "bg-secondary text-muted-foreground rounded-full"
                        }`}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl gap-3 text-base font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Salvar Ambiente
          </Button>
        </div>
      </div>
    </div>
  );
}
