import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  name: string;
  comment: string;
  status: string;
  created_at: string;
}

const CommentsTab = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    setComments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("comments").update({ status }).eq("id", id);
    toast.success(status === "approved" ? "Comentário aprovado" : "Comentário rejeitado");
    fetchComments();
  };

  if (loading) return <p className="text-muted-foreground">A carregar...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comentários para Moderação ({comments.filter(c => c.status === "pending").length} pendentes)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString("pt-PT")}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                c.status === "approved" ? "bg-accent/20 text-accent" :
                c.status === "rejected" ? "bg-destructive/20 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm">{c.comment}</p>
            {c.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-accent" onClick={() => updateStatus(c.id, "approved")}>
                  <Check className="w-3 h-3 mr-1" /> Aprovar
                </Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(c.id, "rejected")}>
                  <X className="w-3 h-3 mr-1" /> Rejeitar
                </Button>
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Sem comentários</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
