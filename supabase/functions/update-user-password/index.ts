import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = [
  "https://kkefwggimxljvelqtcjs.lovableproject.com",
  "https://lovable.dev",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed =
    origin &&
    allowedOrigins.some(
      (allowed) =>
        origin === allowed ||
        origin.endsWith(".lovableproject.com") ||
        origin.endsWith(".lovable.dev") ||
        origin.endsWith(".lovable.app"),
    );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface UpdateUserPasswordRequest {
  user_id: string;
  password: string;
}

function validatePassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  console.log("update-user-password function called, method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: requestingUser },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !requestingUser) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isSuperAdmin, error: roleError } = await userClient.rpc("is_super_admin", {
      _user_id: requestingUser.id,
    });

    if (roleError || !isSuperAdmin) {
      console.error("Role check error:", roleError);
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { user_id, password } = body as UpdateUserPasswordRequest;

    if (!user_id || !password) {
      return new Response(JSON.stringify({ error: "User and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (requestingUser.id === user_id) {
      return new Response(JSON.stringify({ error: "Use the Settings page to change your own password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!validatePassword(password)) {
      return new Response(JSON.stringify({ error: "Password must be between 8 and 128 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(
      user_id,
      {
        password,
      },
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update password. Please try again." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: updatedUser.user.id, email: updatedUser.user.email },
        message: "Password updated successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error("Error in update-user-password function:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
