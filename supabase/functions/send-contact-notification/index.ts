

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ||
  "Raajeshwariy Groups <info@raajeshwariygroups.com>";
const CONTACT_ADMIN_EMAIL =
  Deno.env.get("CONTACT_ADMIN_EMAIL") || "info@raajeshwariygroups.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactNotificationRequest = await req.json();
    
    console.log("Sending contact notification for:", name, email);

    // Send notification to admin
    const adminEmailResponse = await sendEmail(
      [CONTACT_ADMIN_EMAIL],
      `New Contact Form Submission from ${name}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
          </div>
          <div style="padding: 30px; background: #f9f6f2;">
            <h2 style="color: #8B4513; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
            </table>
            <h3 style="color: #8B4513; margin-top: 20px;">Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="background: #8B4513; padding: 15px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">Raajeshwariy Groups - Wedding Halls & Event Services</p>
          </div>
        </div>
      `
    );

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation to user
    const userEmailResponse = await sendEmail(
      [email],
      "Thank you for contacting Raajeshwariy Groups",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You, ${name}!</h1>
          </div>
          <div style="padding: 30px; background: #f9f6f2;">
            <p style="font-size: 16px; color: #333;">Dear ${name},</p>
            <p style="font-size: 16px; color: #333;">
              We have received your message and appreciate you reaching out to us. 
              Our team will review your inquiry and get back to you within 24 hours.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
              <h3 style="color: #8B4513; margin-top: 0;">Your Message:</h3>
              <p style="color: #666; font-style: italic;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="font-size: 16px; color: #333;">
              In the meantime, feel free to explore our mandapams and services on our website.
            </p>
            <p style="font-size: 16px; color: #333;">
              With warm regards,<br>
              <strong>Raajeshwariy Groups Team</strong>
            </p>
          </div>
          <div style="background: #8B4513; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0 0 10px;">info@raajeshwariygroups.com</p>
            <p style="color: white; margin: 0; font-size: 12px;">Raajeshwariy Groups - Wedding Halls & Event Services</p>
          </div>
        </div>
      `
    );

    console.log("User confirmation sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse, 
        userEmail: userEmailResponse 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
