

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ||
  "Raajeshwariy Groups <info@raajeshwariygroups.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const sendEmail = async (to: string[], subject: string, html: string) => {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
};

interface CancellationRequest {
  customerName: string;
  customerEmail: string;
  referenceNumber: string;
  hallName: string;
  eventDate: string;
  eventType: string;
  cancellationReason: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      referenceNumber,
      hallName,
      eventDate,
      eventType,
      cancellationReason,
    }: CancellationRequest = await req.json();

    console.log("Sending cancellation email to:", customerEmail);
    console.log("Cancellation details:", { referenceNumber, hallName, eventDate, cancellationReason });

    if (!customerEmail) {
      console.log("No email provided, skipping cancellation email");
      return new Response(
        JSON.stringify({ success: true, message: "No email provided" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #faf8f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #1a1814 0%, #2d2a24 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <!-- Header -->
            <div style="padding: 30px; text-align: center; border-bottom: 2px solid #c9a962;">
              <h1 style="color: #c9a962; margin: 0; font-size: 28px; letter-spacing: 2px;">RAAJESHWARIY GROUPS</h1>
              <p style="color: #d4c5a9; margin: 10px 0 0 0; font-size: 12px; letter-spacing: 3px;">BOOKING CANCELLATION</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background-color: #faf8f5;">
              <h2 style="color: #1a1814; margin: 0 0 20px 0; font-size: 24px;">Dear ${customerName},</h2>
              
              <p style="color: #4a4a4a; line-height: 1.8; margin: 0 0 25px 0;">
                We regret to inform you that your booking has been <strong style="color: #dc2626;">cancelled</strong>.
              </p>
              
              <!-- Reference Box -->
              <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px; border: 1px solid #fca5a5;">
                <p style="color: #991b1b; margin: 0 0 5px 0; font-size: 12px; letter-spacing: 2px;">CANCELLED BOOKING</p>
                <p style="color: #991b1b; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${referenceNumber}</p>
              </div>
              
              <!-- Booking Details -->
              <div style="background-color: #fff; border: 1px solid #e5e0d5; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: #1a1814; margin: 0 0 20px 0; font-size: 16px; border-bottom: 1px solid #e5e0d5; padding-bottom: 10px;">Booking Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Hall</td>
                    <td style="padding: 8px 0; color: #1a1814; font-size: 14px; text-align: right; font-weight: 600;">${hallName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Event Type</td>
                    <td style="padding: 8px 0; color: #1a1814; font-size: 14px; text-align: right; font-weight: 600;">${eventType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Event Date</td>
                    <td style="padding: 8px 0; color: #1a1814; font-size: 14px; text-align: right; font-weight: 600;">${eventDate}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Reason -->
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">Reason for Cancellation:</h4>
                <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">${cancellationReason || 'No reason provided'}</p>
              </div>
              
              <p style="color: #4a4a4a; line-height: 1.8; margin: 0 0 25px 0; font-size: 14px;">
                If you have any questions or would like to make a new booking, please don't hesitate to contact us.
              </p>
              
              <p style="color: #888; font-size: 12px; margin: 0; font-style: italic;">
                We apologize for any inconvenience caused.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #1a1814; text-align: center;">
              <p style="color: #c9a962; margin: 0; font-size: 12px;">Raajeshwariy Groups - Wedding Halls & Event Services</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await sendEmail(
      [customerEmail],
      `Booking Cancelled - ${referenceNumber}`,
      emailHtml
    );

    console.log("Cancellation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending cancellation email:", error);
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
