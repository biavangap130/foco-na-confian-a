import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/trackClick";

const modules = [
  "Entendendo as causas da impotência sexual",
  "Alimentação que potencializa a performance",
  "Exercícios físicos para melhorar a circulação",
  "Técnicas de controle emocional e ansiedade",
  "Suplementos naturais recomendados",
  "Hábitos diários para manter a vitalidade",
  "Como fortalecer o relacionamento",
  "Plano de ação de 30 dias comprovado",
];

const ContentSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Que Vai Aprender
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Um guia completo e direto ao ponto com tudo o que precisa de saber.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {modules.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-primary-foreground/5 rounded-xl p-4 border border-primary-foreground/10"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-medium font-sans">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold px-10 py-7 rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105"
              onClick={() => { trackClick("comprar_ebook_conteudo"); window.location.href = "https://segredomasculino.lemonsqueezy.com/checkout/buy/f613bad8-9835-4fdb-b61b-6787349f083a?discount=0"; }}
            >
              Comprar e-book agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
