import React from "react";
import { Card } from "@/components/ui/card";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: React.ReactNode;
  className?: string;
};

const AristocratMetricCard = ({
  icon,
  title,
  value,
  subtitle,
  badge,
  className = "flex-2 bg-sidebar-foreground",
}: Props) => {
  return (
    <Card className={`w-auto ${className} border-none shadow-none`} role="region" aria-label={`Métrica: ${title}`}>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-4">
        <div className="flex items-start justify-between">
          <span
            className="flex items-center justify-center bg-accent text-primary size-12 rounded-lg"
            aria-label="Icono de la métrica"
            role="img"
          >
            {icon}
          </span>
          {badge && (
            <span
              className="flex items-center rounded-lg text-muted-foreground text-center text-sm min-h-6 ml-2"
              aria-label="Badge de la métrica"
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-1 mt-2">
          <h3 className="text-md font-medium text-muted-foreground" aria-label="Título de la métrica">
            {title}
          </h3>
          <p className="text-4xl font-bold" aria-label="Valor de la métrica">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground" aria-label="Subtítulo de la métrica">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AristocratMetricCard;
