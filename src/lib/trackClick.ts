import { supabase } from "@/integrations/supabase/client";

let sessionId = sessionStorage.getItem("session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  sessionStorage.setItem("session_id", sessionId);
}

export const trackClick = async (buttonName: string) => {
  try {
    await supabase.from("button_clicks").insert({
      session_id: sessionId!,
      button_name: buttonName,
      page_url: window.location.href,
    });
  } catch (e) {
    console.error("Track click error:", e);
  }
};
