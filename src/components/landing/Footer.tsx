import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso!");
    setEmail("");
    setMessage("");
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans">Entre em Contato</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="O seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
              />
              <Textarea
                placeholder="A sua mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 resize-none"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4 font-sans">Links Úteis</h3>
              <ul className="space-y-2 text-primary-foreground/60 text-sm">
                <li><a href="https://www.termsfeed.com/live/02b61969-89f5-43de-9ae2-161470772ccf" className="hover:text-accent transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Perguntas Frequentes</a></li>
              </ul>
            </div>
            <p className="text-primary-foreground/40 text-xs mt-8">
              © {new Date().getFullYear()} Saúde Masculina. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
