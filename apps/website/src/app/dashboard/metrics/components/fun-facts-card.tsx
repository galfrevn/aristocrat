import React from "react";

import { Card } from "@/components/ui/card";

import { RiFilmAiLine, RiCupLine, RiPlaneLine } from "@remixicon/react";

interface Fact {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  ariaLabel: string;
}

const facts: Fact[] = [
  {
    icon: <RiFilmAiLine />,
    title: "Has ahorrado el tiempo de",
    subtitle: "78 películas completas",
    ariaLabel: "Tiempo ahorrado equivalente a 78 películas completas",
  },
  {
    icon: <RiCupLine />,
    title: "Tiempo suficiente para",
    subtitle: "240 tazas de café",
    ariaLabel: "Tiempo ahorrado equivalente a 240 tazas de café",
  },
  {
    icon: <RiPlaneLine />,
    title: "Podrías haber volado",
    subtitle: "15 veces de Madrid a Nueva York",
    ariaLabel: "Tiempo ahorrado equivalente a 15 vuelos de Madrid a Nueva York",
  },
];

const AristocratFunFactsCard = () => {
  return (
    <Card
      className="flex-1 shadow-none w-auto px-4 py-4 sm:px-6 sm:py-4 bg-sidebar"
      role="region"
      aria-labelledby="fun-facts-title"
    >
      <h2 id="fun-facts-title" className="text-xl font-semibold text-white">
        Datos Curiosos
      </h2>
      <section
        className="flex flex-col justify-around gap-3 h-full"
        aria-label="Lista de datos curiosos sobre tiempo ahorrado"
      >
        {facts.map((fact: Fact, index) => {
          return (
            <article
              key={`fun-fact-${index}`}
              className="bg-accent rounded-lg py-3 px-4 flex items-center gap-5 hover:-translate-y-0.5 transition-transform"
              role="listitem"
              aria-label={fact.ariaLabel}
            >
              <div className="text-primary" aria-hidden="true" role="img">
                {fact.icon}
              </div>
              <div>
                <h3 className="text-primary text-md font-medium">
                  {fact.title}
                </h3>
                <p className="text-muted-foreground text-sm">{fact.subtitle}</p>
              </div>
            </article>
          );
        })}
      </section>
    </Card>
  );
};

export default AristocratFunFactsCard;
