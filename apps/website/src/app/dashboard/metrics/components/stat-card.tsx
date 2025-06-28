import React from "react";
import { Card } from "@/components/ui/card";

interface Props {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const AristocratStatCard = ({ icon, title, value }: Props) => {
  return (
    <Card className="flex flex-row bg-gradient-to-br from-card to-card/80 p-4  w-auto h-auto flex-1 items-center gap-4 shadow-none group">
      <div className="flex items-center justify-center bg-primary/15 text-primary size-12 rounded-lg group-hover:scale-110 transition-transform">
        <span className="" aria-label="Icono de la métrica" role="img">
          {icon}
        </span>
      </div>
      <div>
        <h4 className="text-md font-medium text-muted-foreground">{title}</h4>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
};

export default AristocratStatCard;
