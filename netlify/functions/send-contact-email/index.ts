import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

interface FormData {
  name: string;
  email: string;
  message: string;
  service: string;
}

const validateInput = (data: FormData) => {
  const errors: string[] = [];

  if (!data.name || data.name.length < 2 || data.name.length > 50) {
    errors.push("Name must be between 2 and 50 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Invalid email address");
  }

  if (!data.message || data.message.length < 10 || data.message.length > 500) {
    errors.push("Message must be between 10 and 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const handler: Handler = async (event) => {
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
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }),
      headers: { "Access-Control-Allow-Origin": "*" }
    };
  }

  try {
    const data: FormData = JSON.parse(event.body || "{}");
    
    // Server-side validation
    const validation = validateInput(data);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ 
          error: "Validation failed", 
          details: validation.errors 
        })
      };
    }

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
      subject: `New Contact Form Submission - ${data.service}`,
      text: `
        New Contact Form Submission

        Service: ${data.service}
        Name: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `,
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ 
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};

export { handler };