import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  service?: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, message, service }: ContactFormData = JSON.parse(event.body || "{}");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOSTNAME,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Get recipient emails from environment variable
    const recipientEmails = process.env.CONTACT_FORM_RECIPIENTS?.split(",") || [];
    if (recipientEmails.length === 0) {
      throw new Error("No recipient emails configured");
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: recipientEmails,
      subject: `New Contact Form Submission - CraftCoordination${service ? ` (${service})` : ''}`,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${service ? `Service: ${service}\n` : ''}
        Message:
        ${message}
      `,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};

export { handler };