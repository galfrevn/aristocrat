import { AristocratPageHeader } from "@/app/dashboard/components/header";
import { AristocratPageWrapper } from "@/app/dashboard/components/wrapper";

import AristocratMetricCard from "./components/metric-card";
import AristocratStatCard from "./components/stat-card";

import AristocratPopularTopicsCard from "./components/popular-topics/popular-topics-card";
import AristocratFunFactsCard from "./components/fun-facts-card";

import {
  RiLeafLine,
  RiTimeLine,
  RiStickyNoteLine,
  RiBardLine,
  RiArrowLeftUpLine,
  RiBookOpenLine,
  RiTrophyLine,
  RiFocus2Line,
} from "@remixicon/react";

import { Badge } from "@/components/ui/badge";

const AristocratDashboardMetricsPage = () => (
  <AristocratPageWrapper>
    <AristocratPageHeader
      title="Tu Progreso en Aristocrat"
      description="Así es como estás dominando nuevas habilidades con Aristocrat"
    />

    <section className="flex flex-wrap gap-4">
      <AristocratMetricCard
        className="flex-3 bg-sidebar text-white"
        icon={<RiLeafLine />}
        title="Tiempo Ahorrado Total"
        value="124h"
        subtitle="Equivale a 78 peliculas o 3120 canciones"
        badge={
          <Badge className="badge badge-success text-background bg-sidebar-foreground/70 px-2 py-1 rounded-md text-sm">
            ¡Excelente!
          </Badge>
        }
      />

      <AristocratMetricCard
        icon={<RiTimeLine />}
        title="Horas de Estudio"
        value="47h"
        subtitle="+12h desde la ultima semana"
        badge={
          <span className="badge badge-success">
            <RiArrowLeftUpLine />
          </span>
        }
      />

      <AristocratMetricCard
        icon={<RiStickyNoteLine />}
        title="Notas Creadas"
        value={89}
        subtitle="Promedio: 7 por curso"
        badge={
          <span className="badge badge-success">
            <RiBardLine />
          </span>
        }
      />
    </section>

    <section className="flex flex-wrap gap-4">
      <AristocratStatCard
        title="Cursos Completados"
        value={12}
        icon={<RiBookOpenLine />}
      />
      <AristocratStatCard
        title="Examenes Realizados"
        value={24}
        icon={<RiTrophyLine />}
      />
      <AristocratStatCard
        title="Puntuacion Promedio"
        value="87%"
        icon={<RiFocus2Line />}
      />
    </section>

    <section className="flex flex-wrap gap-4">
      <AristocratPopularTopicsCard />
      <AristocratFunFactsCard />
    </section>
  </AristocratPageWrapper>
);

export default AristocratDashboardMetricsPage;
