import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, MousePointerClick, ShoppingCart, Globe, TrendingUp, BarChart3, Calendar } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, subHours, subWeeks, subMonths, startOfDay, startOfHour, startOfWeek, startOfMonth, isAfter } from "date-fns";
import { pt } from "date-fns/locale";

type TimeRange = "24h" | "7d" | "30d" | "90d";

interface RawVisit {
  id: string;
  created_at: string;
  duration_seconds: number | null;
  country: string | null;
  city: string | null;
  page_url: string;
  referrer: string | null;
  session_id: string;
}

interface RawClick {
  id: string;
  created_at: string;
  button_name: string;
  page_url: string | null;
  session_id: string;
}

interface RawPurchase {
  id: string;
  created_at: string;
  amount_cents: number | null;
  currency: string | null;
  status: string;
  email: string;
  name: string | null;
  product_name: string | null;
}

const COLORS = [
  "hsl(215, 60%, 40%)",
  "hsl(145, 65%, 42%)",
  "hsl(35, 90%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(190, 60%, 45%)",
];

const chartConfigVisits: ChartConfig = {
  visitas: { label: "Visitas", color: "hsl(215, 60%, 40%)" },
};
const chartConfigClicks: ChartConfig = {
  cliques: { label: "Cliques", color: "hsl(145, 65%, 42%)" },
};
const chartConfigPurchases: ChartConfig = {
  compras: { label: "Compras", color: "hsl(35, 90%, 55%)" },
};
const chartConfigRevenue: ChartConfig = {
  receita: { label: "Receita (€)", color: "hsl(145, 65%, 42%)" },
};

function getStartDate(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case "24h": return subHours(now, 24);
    case "7d": return subDays(now, 7);
    case "30d": return subDays(now, 30);
    case "90d": return subDays(now, 90);
  }
}

function getGranularity(range: TimeRange): "hour" | "day" | "week" | "month" {
  switch (range) {
    case "24h": return "hour";
    case "7d": return "day";
    case "30d": return "day";
    case "90d": return "week";
  }
}

function formatBucketLabel(date: Date, granularity: string): string {
  switch (granularity) {
    case "hour": return format(date, "HH:mm", { locale: pt });
    case "day": return format(date, "dd/MM", { locale: pt });
    case "week": return format(date, "'Sem' w", { locale: pt });
    case "month": return format(date, "MMM yy", { locale: pt });
    default: return format(date, "dd/MM", { locale: pt });
  }
}

function bucketDate(date: Date, granularity: string): string {
  switch (granularity) {
    case "hour": return startOfHour(date).toISOString();
    case "day": return startOfDay(date).toISOString();
    case "week": return startOfWeek(date, { weekStartsOn: 1 }).toISOString();
    case "month": return startOfMonth(date).toISOString();
    default: return startOfDay(date).toISOString();
  }
}

const StatsTab = () => {
  const [visits, setVisits] = useState<RawVisit[]>([]);
  const [clicks, setClicks] = useState<RawClick[]>([]);
  const [purchases, setPurchases] = useState<RawPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  useEffect(() => {
    const fetchAll = async () => {
      const [visitsRes, clicksRes, purchasesRes] = await Promise.all([
        supabase.from("page_visits").select("*"),
        supabase.from("button_clicks").select("*"),
        supabase.from("purchases").select("*"),
      ]);
      setVisits(visitsRes.data || []);
      setClicks(clicksRes.data || []);
      setPurchases(purchasesRes.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const startDate = useMemo(() => getStartDate(timeRange), [timeRange]);
  const granularity = useMemo(() => getGranularity(timeRange), [timeRange]);

  const filteredVisits = useMemo(() => visits.filter(v => isAfter(new Date(v.created_at), startDate)), [visits, startDate]);
  const filteredClicks = useMemo(() => clicks.filter(c => isAfter(new Date(c.created_at), startDate)), [clicks, startDate]);
  const filteredPurchases = useMemo(() => purchases.filter(p => isAfter(new Date(p.created_at), startDate) && p.status === "completed"), [purchases, startDate]);

  // KPIs
  const totalVisits = filteredVisits.length;
  const avgDuration = filteredVisits.length
    ? Math.round(filteredVisits.reduce((s, v) => s + (v.duration_seconds || 0), 0) / filteredVisits.length)
    : 0;
  const totalClicks = filteredClicks.length;
  const totalPurchases = filteredPurchases.length;
  const totalRevenue = filteredPurchases.reduce((s, p) => s + (p.amount_cents || 0), 0) / 100;
  const conversionRate = totalVisits > 0 ? ((totalPurchases / totalVisits) * 100).toFixed(1) : "0.0";

  // Time-series data
  const visitTimeSeries = useMemo(() => {
    const map: Record<string, number> = {};
    filteredVisits.forEach(v => {
      const key = bucketDate(new Date(v.created_at), granularity);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => ({ label: formatBucketLabel(new Date(key), granularity), visitas: count }));
  }, [filteredVisits, granularity]);

  const clickTimeSeries = useMemo(() => {
    const map: Record<string, number> = {};
    filteredClicks.forEach(c => {
      const key = bucketDate(new Date(c.created_at), granularity);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => ({ label: formatBucketLabel(new Date(key), granularity), cliques: count }));
  }, [filteredClicks, granularity]);

  const purchaseTimeSeries = useMemo(() => {
    const map: Record<string, { compras: number; receita: number }> = {};
    filteredPurchases.forEach(p => {
      const key = bucketDate(new Date(p.created_at), granularity);
      if (!map[key]) map[key] = { compras: 0, receita: 0 };
      map[key].compras += 1;
      map[key].receita += (p.amount_cents || 0) / 100;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({ label: formatBucketLabel(new Date(key), granularity), ...data }));
  }, [filteredPurchases, granularity]);

  // Click by button name
  const clicksByButton = useMemo(() => {
    const map: Record<string, number> = {};
    filteredClicks.forEach(c => {
      map[c.button_name] = (map[c.button_name] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [filteredClicks]);

  // Country data
  const countryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredVisits.forEach(v => {
      const c = v.country || "Desconhecido";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [filteredVisits]);

  if (loading) return <p className="text-muted-foreground">A carregar...</p>;

  const rangeLabel: Record<TimeRange, string> = {
    "24h": "Últimas 24 horas",
    "7d": "Últimos 7 dias",
    "30d": "Últimos 30 dias",
    "90d": "Últimos 90 dias",
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Painel de Análise
          </h2>
          <p className="text-sm text-muted-foreground">{rangeLabel[timeRange]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Visitas" value={totalVisits} icon={<Users className="w-4 h-4" />} />
        <KPICard title="Duração Média" value={`${avgDuration}s`} icon={<Clock className="w-4 h-4" />} />
        <KPICard title="Cliques" value={totalClicks} icon={<MousePointerClick className="w-4 h-4" />} />
        <KPICard title="Compras" value={totalPurchases} icon={<ShoppingCart className="w-4 h-4" />} />
        <KPICard title="Receita" value={`€${totalRevenue.toFixed(2)}`} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Conversão" value={`${conversionRate}%`} icon={<BarChart3 className="w-4 h-4" />} />
      </div>

      {/* Charts Row 1: Visits + Clicks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Visitas ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitTimeSeries.length > 0 ? (
              <ChartContainer config={chartConfigVisits} className="h-[250px] w-full">
                <AreaChart data={visitTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(215, 60%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(215, 60%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="visitas" stroke="hsl(215, 60%, 40%)" fill="url(#visitGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Cliques ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clickTimeSeries.length > 0 ? (
              <ChartContainer config={chartConfigClicks} className="h-[250px] w-full">
                <BarChart data={clickTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cliques" fill="hsl(145, 65%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Purchases + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Compras ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {purchaseTimeSeries.length > 0 ? (
              <ChartContainer config={chartConfigPurchases} className="h-[250px] w-full">
                <BarChart data={purchaseTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="compras" fill="hsl(35, 90%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Receita ao Longo do Tempo (€)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {purchaseTimeSeries.length > 0 ? (
              <ChartContainer config={chartConfigRevenue} className="h-[250px] w-full">
                <LineChart data={purchaseTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="receita" stroke="hsl(145, 65%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3: Clicks by Button + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <MousePointerClick className="w-4 h-4" /> Cliques por Botão
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clicksByButton.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clicksByButton}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {clicksByButton.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <Globe className="w-4 h-4" /> Visitas por País
            </CardTitle>
          </CardHeader>
          <CardContent>
            {countryData.length > 0 ? (
              <div className="space-y-3">
                {countryData.map((c, i) => {
                  const maxVal = countryData[0]?.value || 1;
                  const pct = (c.value / maxVal) * 100;
                  return (
                    <div key={c.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{c.name}</span>
                        <span className="font-semibold text-foreground">{c.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Últimas Visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Data</th>
                  <th className="text-left py-2 font-medium">Página</th>
                  <th className="text-left py-2 font-medium">Duração</th>
                  <th className="text-left py-2 font-medium">Local</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 20)
                  .map((v, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{new Date(v.created_at).toLocaleString("pt-PT")}</td>
                      <td className="py-2 max-w-[200px] truncate">{v.page_url}</td>
                      <td className="py-2">{v.duration_seconds ? `${v.duration_seconds}s` : "-"}</td>
                      <td className="py-2">{[v.city, v.country].filter(Boolean).join(", ") || "-"}</td>
                    </tr>
                  ))}
                {filteredVisits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground">
                      Sem visitas neste período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function KPICard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
      Sem dados neste período
    </div>
  );
}

export default StatsTab;
