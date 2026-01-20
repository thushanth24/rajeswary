import { createClient } from "npm:@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to trusted domains
const allowedOrigins = [
  "https://kkefwggimxljvelqtcjs.lovableproject.com",
  "https://lovable.dev",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && allowedOrigins.some(allowed => 
    origin === allowed || origin.endsWith('.lovableproject.com') || origin.endsWith('.lovable.dev') || origin.endsWith('.lovable.app')
  );
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "hall_manager";
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

function validateFullName(name: string): boolean {
  return name.length >= 1 && name.length <= 200;
}

function validateRole(role: string): role is "admin" | "hall_manager" {
  return role === "admin" || role === "hall_manager";
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  console.log("create-user function called, method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the requesting user is a super_admin
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      console.log("No authorization header found");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create client with user's token to verify they're a super_admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requestingUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !requestingUser) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if requesting user is super_admin
    const { data: isSuperAdmin, error: roleError } = await userClient
      .rpc('is_super_admin', { _user_id: requestingUser.id });

    if (roleError || !isSuperAdmin) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { email, password, full_name, role } = body as CreateUserRequest;

    // Validate all inputs
    if (!email || !password || !full_name || !role) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validatePassword(password)) {
      return new Response(
        JSON.stringify({ error: "Password must be between 8 and 128 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateFullName(full_name)) {
      return new Response(
        JSON.stringify({ error: "Name must be between 1 and 200 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateRole(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create the user using admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { full_name },
    });

    if (createError) {
      console.error("User creation error:", createError);
      return new Response(
        JSON.stringify({ error: "Failed to create user. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign the role to the new user
    const { error: roleInsertError } = await adminClient
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: role,
        created_by: requestingUser.id,
      });

    if (roleInsertError) {
      console.error("Role insert error:", roleInsertError);
      return new Response(
        JSON.stringify({ 
          error: "User created but role assignment failed. Please contact support.",
          user: { id: newUser.user.id, email: newUser.user.email }
        }),
        { status: 207, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { id: newUser.user.id, email: newUser.user.email },
        message: `User created successfully with role: ${role}`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
