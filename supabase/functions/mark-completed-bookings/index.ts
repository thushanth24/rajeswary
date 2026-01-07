import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    console.log("Marking past confirmed bookings as completed. Today:", today);

    // Update all confirmed bookings where event_date is before today
    const { data, error, count } = await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('status', 'confirmed')
      .lt('event_date', today)
      .select('id, reference_number, event_date');

    if (error) {
      console.error("Error updating bookings:", error);
      throw error;
    }

    console.log(`Updated ${data?.length || 0} bookings to completed status`);
    
    if (data && data.length > 0) {
      console.log("Updated bookings:", data.map(b => b.reference_number).join(', '));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        updatedCount: data?.length || 0,
        updatedBookings: data 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in mark-completed-bookings:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
