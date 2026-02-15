import { Apple, Dumbbell, Moon, Droplets } from "lucide-react";

const tips = [
  {
    icon: Apple,
    title: "Alimentação Estratégica",
    description: "Alimentos ricos em zinco, ômega-3 e antioxidantes que potencializam a saúde sexual masculina.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Dumbbell,
    title: "Exercícios Específicos",
    description: "Rotinas de treino que melhoram a circulação sanguínea e aumentam naturalmente a testosterona.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Moon,
    title: "Qualidade do Sono",
    description: "Como otimizar o sono para maximizar a produção hormonal e a recuperação do corpo.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Droplets,
    title: "Controle do Estresse",
    description: "Técnicas comprovadas de relaxamento que reduzem o cortisol e melhoram o desempenho.",
    color: "bg-primary/10 text-primary",
  },
];

const TipsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dicas Práticas Para a Sua Saúde
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pequenas mudanças de hábitos que geram grandes resultados na sua vitalidade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-5 p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl ${tip.color} flex items-center justify-center flex-shrink-0`}>
                <tip.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1 font-sans">{tip.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
