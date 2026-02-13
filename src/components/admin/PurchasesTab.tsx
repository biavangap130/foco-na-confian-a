import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Purchase {
  id: string;
  email: string;
  name: string | null;
  product_name: string | null;
  amount_cents: number | null;
  currency: string | null;
  status: string;
  created_at: string;
}

const PurchasesTab = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });
      setPurchases(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <p className="text-muted-foreground">A carregar...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Compradores ({purchases.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Produto</th>
                <th className="text-left py-2">Valor</th>
                <th className="text-left py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{new Date(p.created_at).toLocaleString("pt-PT")}</td>
                  <td className="py-2">{p.name || "-"}</td>
                  <td className="py-2">{p.email}</td>
                  <td className="py-2">{p.product_name || "-"}</td>
                  <td className="py-2">
                    {p.amount_cents ? `${(p.amount_cents / 100).toFixed(2)} ${p.currency || "EUR"}` : "-"}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "completed" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">Sem compras registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasesTab;
