import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Carlos M.", age: 45, text: "Uau, o e-book é incrível! Em poucas semanas já senti uma diferença enorme na minha confiança e disposição." },
  { name: "Roberto S.", age: 52, text: "Depois de anos sofrendo em silêncio, finalmente encontrei orientações que realmente funcionam. Recomendo demais!" },
  { name: "André L.", age: 38, text: "O conteúdo é muito bem explicado e prático. Mudei minha alimentação e os resultados apareceram rápido." },
  { name: "Fernando P.", age: 49, text: "Minha esposa percebeu a mudança antes de mim! O e-book transformou nossa relação de verdade." },
  { name: "Marcos V.", age: 55, text: "Eu tinha vergonha de procurar ajuda, mas esse e-book me deu tudo que eu precisava de forma discreta." },
  { name: "João R.", age: 41, text: "As técnicas de controle emocional foram um divisor de águas. Me sinto 10 anos mais jovem!" },
  { name: "Paulo H.", age: 47, text: "Investimento que valeu cada centavo. O plano de 30 dias é simplesmente fantástico." },
  { name: "Ricardo F.", age: 60, text: "Mesmo na minha idade, consegui resultados surpreendentes. O e-book é completo e acessível." },
  { name: "Thiago B.", age: 36, text: "A ansiedade estava acabando comigo. Com as dicas do e-book, recuperei minha autoestima." },
  { name: "Gustavo N.", age: 43, text: "Nunca imaginei que mudanças tão simples poderiam ter tanto impacto. Material de altíssima qualidade!" },
  { name: "Eduardo C.", age: 50, text: "Já tentei de tudo. Esse foi o único método que me trouxe resultados reais e duradouros." },
  { name: "Leandro A.", age: 44, text: "Comprei desconfiado e me surpreendi! O conteúdo é sério, bem embasado e muito prático." },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Que Nossos Leitores Dizem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Histórias reais de transformação e superação.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-3" />
              <p className="text-foreground text-sm leading-relaxed mb-4 font-sans italic">
                "{t.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-sm font-sans">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.age} anos</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
