import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
};

const AristocratStatCard = ({ icon, title, value }: Props) => {
  return (
    <div className="flex bg-secondary p-4 rounded-lg w-auto h-auto flex-1 items-center gap-4">
      <div className="flex items-center justify-center bg-card text-primary size-12 rounded-lg">
        <span className="" aria-label="Icono de la métrica" role="img">
          {icon}
        </span>
      </div>
      <div>
        <h4 className="text-md text-foreground">{title}</h4>
        <p className="text-3xl font-semibold text-primary">{value}</p>
      </div>
    </div>
  );
};

export default AristocratStatCard;
