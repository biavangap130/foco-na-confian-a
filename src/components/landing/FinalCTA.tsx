import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Não Espere Mais Para Mudar Sua Vida
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-2 max-w-xl mx-auto">
          Aproveite o preço promocional por tempo limitado e comece sua transformação hoje.
        </p>
        <p className="text-primary-foreground/50 mb-8">
          De <span className="line-through">R$ 197</span>{" "}
          <span className="text-accent font-bold text-3xl">R$ 47,00</span>
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold px-12 py-8 rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/40"
          onClick={() => window.open("#", "_blank")}
        >
          Comprar e-book agora
        </Button>
        <p className="mt-4 text-primary-foreground/40 text-sm">
          Acesso imediato após a confirmação do pagamento
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
