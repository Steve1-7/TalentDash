import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { z } from "https://cdn.skypack.dev/zod";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const profileSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(1),
  headline: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const method = req.method;

    if (method === "GET") {
      const id = url.searchParams.get("id");
      if (id) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
      }
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
    }

    if (method === "POST") {
      const payload = await req.json();
      const parsed = profileSchema.safeParse(payload);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.errors }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const { data, error } = await supabase.from("profiles").insert(parsed.data).select().single();
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify(data), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    if (method === "PUT") {
      const payload = await req.json();
      const parsed = profileSchema.partial().safeParse(payload);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.errors }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const id = payload.id;
      if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("profiles").update(parsed.data).eq("id", id).select().single();
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
    }

    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
