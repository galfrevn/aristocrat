import React from "react";
import { Card } from "@/components/ui/card";
import AristocratPopularTopicsGraph from "./popular-topics-graph";

interface Topic {
  topic: string;
  hours: number;
  courses: number;
}

const topTopics: Topic[] = [
  {
    topic: "JavaScript",
    hours: 72,
    courses: 6,
  },
  {
    topic: "SQL",
    hours: 65,
    courses: 5,
  },
  {
    topic: "TypeScript",
    hours: 43,
    courses: 4,
  },
];

const AristocratPopularTopicsCard = () => {
  return (
    <Card
      className="flex-2 shadow-none w-auto px-4 py-4 sm:px-6 sm:py-4 justify-start"
      role="region"
    >
      <h2 id="skills-dominance-title" className="text-xl font-semibold">
        Tu Dominio de Habilidades
      </h2>

      <main className="flex gap-2">
        <AristocratPopularTopicsGraph />

        <section className="w-full">
          <h2 className="text-xl">Tus especialidades</h2>
          <div>
            {topTopics.map((topic, index) => (
              <article
                key={index}
                className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0 hover:-translate-x-0.5 transition-transform"
                role="listitem"
                aria-label={`Especialidad ${index + 1}: ${topic.topic}`}
              >
                <div
                  className="flex items-center justify-center bg-primary/15 text-primary size-10 rounded-lg font-semibold text-sm"
                  aria-hidden="true"
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground font-medium truncate">
                    {topic.topic}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {topic.courses}{" "}
                    {topic.courses === 1
                      ? "curso completado"
                      : "cursos completados"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {topic.hours}h
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Card>
  );
};

export default AristocratPopularTopicsCard;
