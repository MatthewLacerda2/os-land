import {
  maintenanceApi,
  type MaintenanceViewResponse,
} from "@/api/maintenance-api";
import PageHeader from "@/components/common/PageHeader";
import MaintenanceDetailCard from "@/components/service/view/maintenance-detail-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Empty default keeps photo URLs same-origin (/uploads/...), served via the
// nginx (prod) / Vite dev proxy. Override with VITE_API_URL for a remote origin.
const API_URL = import.meta.env.VITE_API_URL || "";

export default function MaintenanceView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<MaintenanceViewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await maintenanceApi.view(id);
        setData(response);
      } catch (err: unknown) {
        console.error("Fetch detail error:", err);
        setError("Não foi possível carregar os detalhes da manutenção.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${API_URL}/uploads/${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Carregando detalhes...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-6 text-center gap-4">
        <div className="p-6 bg-destructive/10 rounded-3xl border border-destructive/20 max-w-xs">
          <p className="text-sm text-destructive font-medium">
            {error || "Ordem de serviço não encontrada."}
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-2xl"
        >
          Voltar ao Histórico
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-muted/50 pb-10">
      {/* Page Header */}
      <PageHeader
        title="Detalhes da Manutenção"
        subtitle={data.osNumber}
        back={-1}
      />

      <div className="px-6 space-y-6">
        {/* General Info Section */}
        <Card className="rounded-3xl shadow-sm border-border overflow-hidden">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2 grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Empresa / Agência
              </p>
              <p className="text-sm font-bold text-foreground">
                {data.company} - {data.agency}{" "}
                {data.agencyName && `(${data.agencyName})`}
              </p>
            </div>
            {data.assetNumber && (
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Nº de Bem
                </p>
                <p className="text-sm font-bold text-foreground">
                  {data.assetNumber}
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Localização
              </p>
              <p className="text-sm font-bold text-foreground">{data.state}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Técnico
              </p>
              <p className="text-sm font-bold text-foreground">
                {data.technicianName || "N/A"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Data/Hora
              </p>
              <p className="text-sm font-bold text-foreground">
                {formatDate(data.createdAt)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Protocolo
              </p>
              <p className="text-sm font-bold text-foreground">
                {data.protocolType === "preventive"
                  ? "Preventiva"
                  : "Corretiva"}
              </p>
            </div>
            {data.environmentName && (
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Ambiente
                </p>
                <p className="text-sm font-bold text-foreground">
                  {data.environmentName}
                </p>
              </div>
            )}
            {data.description && (
              <div className="col-span-2 space-y-0.5 mt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Descrição
                </p>
                <p className="text-sm text-foreground leading-relaxed italic">
                  {data.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Environments List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider px-1">
            Relatório de Ambientes
          </h3>

          {data.environments.map((env) => (
            <MaintenanceDetailCard
              key={env.id}
              system={env.designatedSystem}
              photos={env.photos}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>

        {/* Back Button */}
        <div className="pt-2">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full h-14 rounded-2xl border-border text-foreground gap-3 text-base font-bold"
          >
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    </div>
  );
}
