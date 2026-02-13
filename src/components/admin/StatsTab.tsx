import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, MousePointerClick, ShoppingCart, Globe } from "lucide-react";

interface Stats {
  totalVisits: number;
  avgDuration: number;
  buttonClicks: number;
  totalPurchases: number;
  countries: { country: string; count: number }[];
  recentVisits: { page_url: string; created_at: string; duration_seconds: number | null; country: string | null; city: string | null }[];
}

const StatsTab = () => {
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    avgDuration: 0,
    buttonClicks: 0,
    totalPurchases: 0,
    countries: [],
    recentVisits: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [visitsRes, clicksRes, purchasesRes] = await Promise.all([
        supabase.from("page_visits").select("*"),
        supabase.from("button_clicks").select("*"),
        supabase.from("purchases").select("*").eq("status", "completed"),
      ]);

      const visits = visitsRes.data || [];
      const clicks = clicksRes.data || [];
      const purchases = purchasesRes.data || [];

      const totalDuration = visits.reduce((sum, v) => sum + (v.duration_seconds || 0), 0);
      const avgDuration = visits.length ? Math.round(totalDuration / visits.length) : 0;

      const countryMap: Record<string, number> = {};
      visits.forEach((v) => {
        const c = v.country || "Desconhecido";
        countryMap[c] = (countryMap[c] || 0) + 1;
      });
      const countries = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        totalVisits: visits.length,
        avgDuration,
        buttonClicks: clicks.length,
        totalPurchases: purchases.length,
        countries,
        recentVisits: visits.slice(-20).reverse(),
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-muted-foreground">A carregar...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitas</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalVisits}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duração Média</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.avgDuration}s</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cliques no Botão</CardTitle>
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.buttonClicks}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compras</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalPurchases}</p></CardContent>
        </Card>
      </div>

      {stats.countries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-4 h-4" /> Visitas por País
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.countries.map((c) => (
                <div key={c.country} className="flex justify-between text-sm">
                  <span>{c.country}</span>
                  <span className="font-semibold">{c.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimas Visitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2">Data</th>
                  <th className="text-left py-2">Página</th>
                  <th className="text-left py-2">Duração</th>
                  <th className="text-left py-2">Local</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisits.map((v, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{new Date(v.created_at).toLocaleString("pt-PT")}</td>
                    <td className="py-2">{v.page_url}</td>
                    <td className="py-2">{v.duration_seconds ? `${v.duration_seconds}s` : "-"}</td>
                    <td className="py-2">{[v.city, v.country].filter(Boolean).join(", ") || "-"}</td>
                  </tr>
                ))}
                {stats.recentVisits.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Sem visitas registradas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
