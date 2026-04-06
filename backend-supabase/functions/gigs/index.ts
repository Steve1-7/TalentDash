import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { z } from "https://cdn.skypack.dev/zod";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const gigSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  owner_id: z.string(),
});

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (method === "GET") {
      const id = url.searchParams.get("id");
      if (id) {
        const { data, error } = await supabase.from("gigs").select("*").eq("id", id).single();
        if (error) return jsonError(error.message, 500);
        return jsonResponse(data);
      }
      const { data, error } = await supabase.from("gigs").select("*");
      if (error) return jsonError(error.message, 500);
      return jsonResponse(data);
    }

    if (method === "POST") {
      const payload = await req.json();
      const parsed = gigSchema.safeParse(payload);
      if (!parsed.success) {
        return jsonError(JSON.stringify(parsed.error.errors), 400);
      }
      const { data, error } = await supabase.from("gigs").insert(parsed.data).select().single();
      if (error) return jsonError(error.message, 500);
      return jsonResponse(data, 201);
    }

    if (method === "PUT") {
      const payload = await req.json();
      const parsed = gigSchema.partial().safeParse(payload);
      if (!parsed.success) {
        return jsonError(JSON.stringify(parsed.error.errors), 400);
      }
      const id = payload.id;
      if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("gigs").update(parsed.data).eq("id", id).select().single();
      if (error) return jsonError(error.message, 500);
      return jsonResponse(data);
    }

    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return jsonError('id required', 400);
      const { error } = await supabase.from("gigs").delete().eq("id", id);
      if (error) return jsonError(error.message, 500);
      return jsonResponse({ success: true });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders() });
  } catch (err) {
    return jsonError(String(err), 500);
  }
});

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: corsHeaders() });
}
