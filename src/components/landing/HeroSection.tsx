import { Button } from "@/components/ui/button";
import { BadgeCheck, Users, Mail } from "lucide-react";
import ebookMockup from "@/assets/ebook-mockup.png";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/trackClick";
import CountdownTimer from "./CountdownTimer";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(215,65%,10%)] to-[hsl(215,55%,22%)] opacity-95" />
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold tracking-wide uppercase">
                <BadgeCheck className="w-5 h-5" />
                Método Comprovado
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm font-semibold">
                🇵🇹 Feito para homens portugueses
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
              Recupere Sua <span className="text-accent">Confiança</span> e Vitalidade Masculina
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              Descubra orientações práticas e naturais que já ajudaram milhares de homens portugueses a superarem a impotência sexual e reconquistarem uma vida plena.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <Users className="w-4 h-4 text-accent" />
              <span>Mais de <strong className="text-accent">2.700 homens</strong> já transformaram suas vidas</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold px-10 py-7 rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/40"
                onClick={() => { trackClick("comprar_ebook_hero"); window.location.href = "https://segredomasculino.lemonsqueezy.com/checkout/buy/f613bad8-9835-4fdb-b61b-6787349f083a?discount=0"; }}
              >
                Comprar e-book agora
              </Button>
              <div className="text-sm text-primary-foreground/60 self-center space-y-1 text-center">
                <p>
                  De <span className="line-through">€78,00</span>{" "}
                  <span className="text-accent font-bold text-xl">€39,99</span>
                </p>
                <p className="text-accent font-semibold text-xs">🔥 Promoção: 50% de desconto!</p>
              </div>
            </div>
            <CountdownTimer />
            <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
              <Mail className="w-3.5 h-3.5" />
              <span>Receba o e-book no seu email imediatamente após o pagamento</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-64 md:w-80 lg:w-96">
            <img
              src={ebookMockup}
              alt="E-book O Segredo para Dominar uma Mulher"
              className="w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
