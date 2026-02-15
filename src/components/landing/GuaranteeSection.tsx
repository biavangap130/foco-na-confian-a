import { ShieldCheck, Lock, RefreshCcw } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Garantia Incondicional de 7 Dias
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Se por qualquer motivo não ficar satisfeito com o conteúdo do e-book, devolvemos 100% do seu dinheiro em até 7 dias. Sem perguntas, sem burocracia.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground font-sans">Pagamento 100% Seguro</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground font-sans">Devolução Garantida</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground font-sans">Privacidade Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
