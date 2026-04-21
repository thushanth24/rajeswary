import { createHash } from "node:crypto";
import { createClient } from "npm:@supabase/supabase-js@2";

function md5(input: string): string {
  return createHash("md5").update(input).digest("hex").toUpperCase();
}

/** UUID v4 pattern — used to detect bungalow bookings vs hall reference numbers. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const merchantSecret = Deno.env.get("PAYHERE_MERCHANT_SECRET");
    const merchantId = Deno.env.get("PAYHERE_MERCHANT_ID");

    if (!merchantSecret || !merchantId) {
      console.error("PayHere credentials not configured");
      return new Response("Not configured", { status: 500 });
    }

    // PayHere sends application/x-www-form-urlencoded
    const formData = await req.formData();
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }

    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig, payment_id } = data;

    // Verify signature: MD5(merchant_id + order_id + amount + currency + status_code + MD5(secret).UPPER()).UPPER()
    const secretHash = md5(merchantSecret);
    const expectedSig = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash);

    if (expectedSig !== md5sig) {
      console.error(`Invalid signature for order ${order_id}. Expected: ${expectedSig}, Got: ${md5sig}`);
      return new Response("Invalid signature", { status: 400 });
    }

    console.log(`PayHere notify: order=${order_id}, status=${status_code}, amount=${payhere_amount} ${payhere_currency}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── Bungalow booking (order_id is a UUID) ────────────────────────────────
    if (UUID_RE.test(order_id)) {
      if (status_code === "2") {
        // Payment successful → confirm the booking
        const { error } = await (supabase as any)
          .from("bungalow_bookings")
          .update({
            status: "confirmed",
            payment_status: "paid",
            paid_amount: Number.parseFloat(payhere_amount),
            payment_paid_at: new Date().toISOString(),
            payment_provider: "PayHere",
            payment_reference: payment_id ?? null,
          })
          .eq("id", order_id)
          .eq("status", "pending_payment"); // safety: only confirm if still pending

        if (error) {
          console.error(`Failed to confirm bungalow booking ${order_id}:`, error.message);
        } else {
          console.log(`Bungalow booking ${order_id} confirmed via PayHere payment.`);
        }
      } else if (status_code === "-1" || status_code === "-2" || status_code === "-3") {
        // Cancelled / failed / chargedback → release the room hold
        const { error } = await (supabase as any)
          .from("bungalow_bookings")
          .update({ status: "cancelled", payment_status: "failed" })
          .eq("id", order_id)
          .eq("status", "pending_payment");

        if (error) {
          console.error(`Failed to cancel bungalow booking ${order_id}:`, error.message);
        } else {
          console.log(`Bungalow booking ${order_id} cancelled (payment ${status_code}).`);
        }
      }
    }
    // ── Hall booking (order_id is CH-YEAR-XXXXX) ─────────────────────────────
    else {
      if (status_code === "2") {
        const note = `[Advance Payment Received] LKR ${payhere_amount} via PayHere on ${new Date().toISOString()}`;

        const { data: booking } = await supabase
          .from("bookings")
          .select("internal_notes")
          .eq("reference_number", order_id)
          .single();

        if (booking) {
          const updatedNotes = booking.internal_notes
            ? `${booking.internal_notes}\n${note}`
            : note;

          const { error } = await supabase
            .from("bookings")
            .update({
              internal_notes: updatedNotes,
              payment_status: "paid",
              advance_paid_amount: Number.parseFloat(payhere_amount),
              payment_paid_at: new Date().toISOString(),
              payment_provider: "PayHere",
              payment_reference: payment_id ?? null,
            })
            .eq("reference_number", order_id);

          if (error) {
            console.error(`Failed to update hall booking ${order_id}:`, error.message);
          } else {
            console.log(`Hall booking ${order_id} updated with advance payment note.`);
          }
        } else {
          console.warn(`Hall booking not found for reference: ${order_id}`);
        }
      } else if (status_code === "-1" || status_code === "-2" || status_code === "-3") {
        const { error } = await supabase
          .from("bookings")
          .update({ payment_status: "failed" })
          .eq("reference_number", order_id);

        if (error) {
          console.error(`Failed to mark hall booking ${order_id} payment failed:`, error.message);
        }
      }
    }

    // Always 200 so PayHere stops retrying
    return new Response("OK", { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("payhere-notify error:", message);
    return new Response("OK", { status: 200 });
  }
});
