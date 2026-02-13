import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, ShoppingBag, MessageSquare, Mail } from "lucide-react";
import StatsTab from "@/components/admin/StatsTab";
import PurchasesTab from "@/components/admin/PurchasesTab";
import CommentsTab from "@/components/admin/CommentsTab";
import ContactsTab from "@/components/admin/ContactsTab";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }
      const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: user.id });
      if (!isAdmin) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Backoffice</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </header>
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stats">
          <TabsList className="mb-6">
            <TabsTrigger value="stats"><BarChart3 className="w-4 h-4 mr-2" />Estatísticas</TabsTrigger>
            <TabsTrigger value="purchases"><ShoppingBag className="w-4 h-4 mr-2" />Compras</TabsTrigger>
            <TabsTrigger value="comments"><MessageSquare className="w-4 h-4 mr-2" />Comentários</TabsTrigger>
            <TabsTrigger value="contacts"><Mail className="w-4 h-4 mr-2" />Contatos</TabsTrigger>
          </TabsList>
          <TabsContent value="stats"><StatsTab /></TabsContent>
          <TabsContent value="purchases"><PurchasesTab /></TabsContent>
          <TabsContent value="comments"><CommentsTab /></TabsContent>
          <TabsContent value="contacts"><ContactsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
