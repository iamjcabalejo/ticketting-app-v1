import { Resend } from "resend";

/** Reads RESEND_FROM_EMAIL from .env (e.g. "Support <support@example.com>") */
function getFromAddress(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  return from || null;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    return null;
  }
  return new Resend(apiKey);
}

export interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qrCode: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/** Escape string for safe use in HTML text content / attributes */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends a registration confirmation email with QR code using Resend
 */
export async function sendRegistrationEmail(data: EmailData): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is missing or empty");
    return {
      success: false,
      error: "Email service is not configured (missing RESEND_API_KEY)",
    };
  }

  const fromAddress = getFromAddress();
  if (!fromAddress) {
    console.error("RESEND_FROM_EMAIL is missing or empty in .env");
    return {
      success: false,
      error: "Email service is not configured (missing RESEND_FROM_EMAIL in .env)",
    };
  }

  try {
    const base64Content = data.qrCode.startsWith("data:image/png;base64,")
      ? data.qrCode.replace(/^data:image\/png;base64,/, "")
      : data.qrCode;
    const attachmentBuffer = Buffer.from(base64Content, "base64");

    const htmlEmail = generateHTMLEmailTemplateWithCID(data);

    const { data: resendData, error } = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      subject: "Event Registration Confirmation",
      html: htmlEmail,
      attachments: [
        {
          content: attachmentBuffer,
          filename: "qr-code.png",
          contentId: "qr-code-image",
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: error?.message ?? "Failed to send email",
      };
    }

    return {
      success: true,
      messageId: resendData?.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send registration email:", message);
    return {
      success: false,
      error: "Network error while sending email",
    };
  }
}

function generateHTMLEmailTemplateWithCID(data: EmailData): string {
  const firstName = escapeHtml(data.firstName);
  const lastName = escapeHtml(data.lastName);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const fullName = `${firstName} ${lastName}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; text-align: center;">
          Event Registration Confirmation
        </h1>
        
        <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
          Dear ${fullName},
        </p>
        
        <p style="color: #374151; font-size: 16px; margin-bottom: 30px;">
          Thank you for registering for our event! Your registration has been confirmed. 
          Please find your QR code below, which you'll need to present at the event entrance.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 30px; margin: 30px 0; text-align: center; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 20px;">
            Your Event QR Code
          </h3>
          
           <div style="display: flex; justify-content: center; margin-bottom: 20px; text-align: center;">
             <img src="cid:qr-code-image" alt="QR Code" style="width: 200px; height: 200px; border: 1px solid #d1d5db; border-radius: 4px; background-color: #f9f9f9; margin: 0 auto;" />
           </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
            Scan this QR code at the event entrance
          </p>
          
          <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #d1d5db; font-size: 12px; color: #374151; text-align: left;">
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
        </div>
        
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">
            Important Information:
          </h4>
          <ul style="color: #1e40af; font-size: 14px; margin: 0; padding-left: 20px;">
            <li>Please arrive 15 minutes before the event starts</li>
            <li>Bring a valid ID for verification</li>
            <li>Keep this email as your ticket confirmation</li>
            <li>Contact us if you have any questions</li>
          </ul>
        </div>
        
        <p style="color: #374151; font-size: 16px; margin-top: 30px; text-align: center;">
          We look forward to seeing you at the event!
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px; text-align: center;">
          Best regards,<br />
          The Event Team
        </p>
      </div>
    </body>
    </html>
  `;
}
