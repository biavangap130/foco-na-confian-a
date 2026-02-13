import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface ContactRequest {
  id: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactsTab = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const markResolved = async (id: string) => {
    await supabase.from("contact_requests").update({ status: "resolved" }).eq("id", id);
    toast.success("Marcado como resolvido");
    fetchContacts();
  };

  if (loading) return <p className="text-muted-foreground">A carregar...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pedidos de Contato ({contacts.filter(c => c.status === "pending").length} pendentes)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{c.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString("pt-PT")}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                c.status === "resolved" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
              }`}>
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm">{c.message}</p>
            {c.status === "pending" && (
              <Button size="sm" variant="outline" className="mt-3 text-accent" onClick={() => markResolved(c.id)}>
                <Check className="w-3 h-3 mr-1" /> Resolvido
              </Button>
            )}
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Sem pedidos de contato</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
