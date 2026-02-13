import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const digest = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return digest === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("LEMON_SQUEEZY_WEBHOOK_SECRET is not configured");
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (signature) {
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event?.meta?.event_name;

    console.log("Lemon Squeezy event received:", eventName);

    if (eventName === "order_created") {
      const attrs = event?.data?.attributes;
      const email = attrs?.user_email || "";
      const name = attrs?.user_name || "";
      const orderId = String(event?.data?.id || "");
      const status = attrs?.status || "";
      const totalCents = attrs?.total || 0;
      const currency = attrs?.currency || "EUR";
      const productName = attrs?.first_order_item?.product_name || "E-book";

      const isPaid =
        status === "paid" ||
        status === "completed" ||
        attrs?.status_formatted === "Paid";

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await supabase.from("purchases").insert({
        email,
        name,
        lemon_squeezy_order_id: orderId,
        amount_cents: totalCents,
        currency,
        product_name: productName,
        status: isPaid ? "completed" : "pending",
      });

      console.log(`Purchase recorded for ${email}, status: ${isPaid ? "completed" : "pending"}`);

      // Return the ebook download link if paid
      if (isPaid) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Payment confirmed. Ebook access granted.",
            // Lemon Squeezy handles file delivery automatically via the product's download settings.
            // The user receives the download link in their confirmation email from Lemon Squeezy.
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(JSON.stringify({ success: true, received: eventName }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
