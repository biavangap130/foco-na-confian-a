import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/trackClick";
import CountdownTimer from "./CountdownTimer";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Não Espere Mais Para Mudar Sua Vida
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-2 max-w-xl mx-auto">
          Aproveite o preço promocional por tempo limitado e comece a sua transformação hoje.
        </p>
        <p className="text-primary-foreground/50 mb-2">
          De <span className="line-through">€78,00</span>{" "}
          <span className="text-accent font-bold text-3xl">€39,99</span>
        </p>
        <p className="text-accent font-semibold text-sm mb-4">🔥 Promoção: 50% de desconto!</p>
        <div className="mb-6">
          <CountdownTimer />
        </div>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold px-12 py-8 rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/40"
          onClick={() => { trackClick("comprar_ebook_cta_final"); window.location.href = "https://segredomasculino.lemonsqueezy.com/checkout/buy/f613bad8-9835-4fdb-b61b-6787349f083a?discount=0"; }}
        >
          Comprar e-book agora
        </Button>
        <p className="mt-4 text-primary-foreground/50 text-sm">
          📧 Receba o e-book no seu email imediatamente após o pagamento
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
