import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function md5(input: string): string {
  return createHash("md5").update(input).digest("hex").toUpperCase();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const merchantId = Deno.env.get("PAYHERE_MERCHANT_ID");
    const merchantSecret = Deno.env.get("PAYHERE_MERCHANT_SECRET");
    const mode = Deno.env.get("PAYHERE_MODE") ?? "live";

    if (!merchantId || !merchantSecret) {
      return new Response(
        JSON.stringify({ error: "PayHere credentials not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const {
      orderId,
      amount,
      firstName,
      lastName,
      email,
      phone,
      hallName,
      // Optional: caller can override return/cancel URLs
      returnUrl,
      cancelUrl,
    } = body;

    if (!orderId || !amount || !firstName || !phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, amount, firstName, phone" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Amount must be greater than 0" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const formattedAmount = parsedAmount.toFixed(2);
    const currency = "LKR";

    // PayHere hash: MD5(merchant_id + order_id + amount + currency + MD5(secret).UPPER()).UPPER()
    const secretHash = md5(merchantSecret);
    const hash = md5(merchantId + orderId + formattedAmount + currency + secretHash);

    const checkoutUrl =
      mode === "sandbox"
        ? "https://sandbox.payhere.lk/pay/checkout"
        : "https://www.payhere.lk/pay/checkout";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const notifyUrl = `${supabaseUrl}/functions/v1/payhere-notify`;

    return new Response(
      JSON.stringify({
        checkoutUrl,
        fields: {
          merchant_id: merchantId,
          return_url: returnUrl ?? "https://raajeshwariygroups.com/?payment=success",
          cancel_url: cancelUrl ?? "https://raajeshwariygroups.com/booking",
          notify_url: notifyUrl,
          order_id: orderId,
          items: `Advance Booking Payment - ${hallName ?? "Wedding Hall"}`,
          currency,
          amount: formattedAmount,
          first_name: firstName,
          last_name: lastName ?? "",
          email: email ?? "",
          phone,
          address: "N/A",
          city: "Jaffna",
          country: "Sri Lanka",
          hash,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("payhere-checkout error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
