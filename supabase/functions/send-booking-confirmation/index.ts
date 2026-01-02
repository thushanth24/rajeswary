import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const sendEmail = async (to: string[], subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Chandra Hall Bookings <onboarding@resend.dev>",
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

interface BookingConfirmationRequest {
  customerName: string;
  customerEmail: string;
  referenceNumber: string;
  hallName: string;
  eventDate: string;
  eventType: string;
  expectedGuests: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
      expectedGuests,
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation to:", customerEmail);
    console.log("Booking details:", { referenceNumber, hallName, eventDate, eventType });

    if (!customerEmail) {
      console.log("No email provided, skipping confirmation email");
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
              <h1 style="color: #c9a962; margin: 0; font-size: 28px; letter-spacing: 2px;">CHANDRA HALL</h1>
              <p style="color: #d4c5a9; margin: 10px 0 0 0; font-size: 12px; letter-spacing: 3px;">TRADITIONAL CELEBRATIONS</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background-color: #faf8f5;">
              <h2 style="color: #1a1814; margin: 0 0 20px 0; font-size: 24px;">Namaste, ${customerName}!</h2>
              
              <p style="color: #4a4a4a; line-height: 1.8; margin: 0 0 25px 0;">
                Thank you for your booking request. We have received your inquiry and our team will contact you within <strong>24 hours</strong> to confirm your booking.
              </p>
              
              <!-- Reference Box -->
              <div style="background: linear-gradient(135deg, #c9a962 0%, #e8d4a0 100%); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
                <p style="color: #1a1814; margin: 0 0 5px 0; font-size: 12px; letter-spacing: 2px;">YOUR REFERENCE NUMBER</p>
                <p style="color: #1a1814; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 3px;">${referenceNumber}</p>
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
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Expected Guests</td>
                    <td style="padding: 8px 0; color: #1a1814; font-size: 14px; text-align: right; font-weight: 600;">${expectedGuests}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4a4a4a; line-height: 1.8; margin: 0 0 25px 0; font-size: 14px;">
                Please save your reference number for future communication. If you have any questions, feel free to contact us.
              </p>
              
              <p style="color: #888; font-size: 12px; margin: 0; font-style: italic;">
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #1a1814; text-align: center;">
              <p style="color: #c9a962; margin: 0; font-size: 12px;">© Chandra Hall - Creating Memorable Celebrations</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await sendEmail(
      [customerEmail],
      `Booking Request Received - ${referenceNumber}`,
      emailHtml
    );

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
