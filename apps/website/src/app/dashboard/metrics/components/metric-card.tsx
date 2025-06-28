import React from "react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: React.ReactNode;
  className?: string;
}

const AristocratMetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  badge,
  className = "flex-2 bg-sidebar-foreground",
}) => {
  const cardId = `metric-card-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <Card
      id={cardId}
      className={`w-auto ${className} border-none shadow-none group hover:shadow-md transition-shadow duration-200`}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={subtitle ? `${cardId}-subtitle` : undefined}
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-4">
        <header className="flex items-start justify-between">
          <div
            className="flex items-center justify-center bg-accent text-primary size-12 rounded-lg group-hover:rotate-6 transition-transform duration-300 ease-in-out"
            aria-hidden="true"
          >
            {icon}
          </div>
          {badge && (
            <div
              className="flex items-center rounded-lg text-muted-foreground text-center text-sm min-h-6 ml-2"
              aria-label="Indicador adicional"
            >
              {badge}
            </div>
          )}
        </header>

        <section className="flex flex-col space-y-2">
          <h3
            id={`${cardId}-title`}
            className="text-md font-medium text-muted-foreground leading-tight"
          >
            {title}
          </h3>
          <p
            className="text-4xl font-bold leading-none tracking-tight"
            aria-label={`Valor de ${title}: ${value}`}
          >
            {value}
          </p>
          {subtitle && (
            <p
              id={`${cardId}-subtitle`}
              className="text-base text-muted-foreground leading-relaxed"
            >
              {subtitle}
            </p>
          )}
        </section>
      </div>
    </Card>
  );
};

export default AristocratMetricCard;
