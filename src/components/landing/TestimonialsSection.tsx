import { useState } from "react";
import { Star, Quote, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const testimonials = [
  { name: "Carlos M.", age: 45, initials: "CM", text: "Uau, o e-book é incrível! Em poucas semanas já senti uma diferença enorme na minha confiança e disposição." },
  { name: "Roberto S.", age: 52, initials: "RS", text: "Depois de anos sofrendo em silêncio, finalmente encontrei orientações que realmente funcionam. Recomendo demais!" },
  { name: "André L.", age: 38, initials: "AL", text: "O conteúdo é muito bem explicado e prático. Mudei minha alimentação e os resultados apareceram rápido." },
  { name: "Fernando P.", age: 49, initials: "FP", text: "Minha esposa percebeu a mudança antes de mim! O e-book transformou nossa relação de verdade." },
  { name: "Marcos V.", age: 55, initials: "MV", text: "Eu tinha vergonha de procurar ajuda, mas esse e-book me deu tudo que eu precisava de forma discreta." },
  { name: "João R.", age: 41, initials: "JR", text: "As técnicas de controle emocional foram um divisor de águas. Me sinto 10 anos mais jovem!" },
  { name: "Paulo H.", age: 47, initials: "PH", text: "Investimento que valeu cada centavo. O plano de 30 dias é simplesmente fantástico." },
  { name: "Ricardo F.", age: 60, initials: "RF", text: "Mesmo na minha idade, consegui resultados surpreendentes. O e-book é completo e acessível." },
  { name: "Thiago B.", age: 36, initials: "TB", text: "A ansiedade estava acabando comigo. Com as dicas do e-book, recuperei minha autoestima." },
  { name: "Gustavo N.", age: 43, initials: "GN", text: "Nunca imaginei que mudanças tão simples poderiam ter tanto impacto. Material de altíssima qualidade!" },
  { name: "Eduardo C.", age: 50, initials: "EC", text: "Já tentei de tudo. Esse foi o único método que me trouxe resultados reais e duradouros." },
  { name: "Leandro A.", age: 44, initials: "LA", text: "Comprei desconfiado e me surpreendi! O conteúdo é sério, bem embasado e muito prático." },
];

const avatarColors = [
  "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600",
  "bg-violet-600", "bg-teal-600", "bg-orange-600", "bg-indigo-600",
  "bg-cyan-600", "bg-pink-600", "bg-lime-700", "bg-fuchsia-600",
];

const TestimonialsSection = () => {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("O seu comentário foi enviado para análise, obrigado!");
    setCommentName("");
    setCommentText("");
  };

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
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`${avatarColors[i]} text-white text-xs font-bold`}>
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground text-sm font-sans">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.age} anos</p>
                  </div>
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

        {/* Fake comment form */}
        <div className="max-w-2xl mx-auto mt-14">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-1 font-sans">Deixe o seu comentário</h3>
            <p className="text-muted-foreground text-sm mb-5">Partilhe a sua experiência com o e-book.</p>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Input
                placeholder="Seu nome"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                maxLength={100}
              />
              <Textarea
                placeholder="Escreva o seu comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold gap-2"
              >
                <Send className="w-4 h-4" />
                Deixar Comentário
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
