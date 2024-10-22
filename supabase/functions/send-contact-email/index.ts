import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();
    
    const client = new SmtpClient();
    
    const recipientEmails = Deno.env.get("CONTACT_FORM_RECIPIENTS")?.split(",") || [];
    if (recipientEmails.length === 0) {
      console.error("No recipient emails configured");
      throw new Error("No recipient emails configured");
    }

    await client.connectTLS({
      hostname: Deno.env.get("SMTP_HOSTNAME") || "",
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });

    const emailBody = `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `;

    await client.send({
      from: Deno.env.get("SMTP_FROM_EMAIL") || "",
      to: recipientEmails,
      subject: "New Contact Form Submission - CraftCoordination",
      content: emailBody,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});