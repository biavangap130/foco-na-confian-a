import { AlertTriangle, Brain, HeartPulse, ShieldCheck } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Insegurança e Frustração",
    description: "A impotência afeta diretamente a autoestima e a confiança, gerando um ciclo de ansiedade que piora o problema.",
  },
  {
    icon: Brain,
    title: "Causas Psicológicas Ignoradas",
    description: "Estresse, ansiedade e pressão do dia a dia são fatores que muitos homens desconhecem como causadores.",
  },
  {
    icon: HeartPulse,
    title: "Saúde Física Comprometida",
    description: "Má alimentação, sedentarismo e hábitos prejudiciais impactam diretamente a performance masculina.",
  },
  {
    icon: ShieldCheck,
    title: "Solução Natural e Comprovada",
    description: "Nosso e-book reúne estratégias validadas por especialistas para recuperar sua vitalidade sem medicamentos.",
  },
];

const ProblemsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Não Está Sozinho Nesta Luta
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Milhares de homens portugueses enfrentam este desafio em silêncio. Entenda as causas e descubra como superá-las.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2 font-sans">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
