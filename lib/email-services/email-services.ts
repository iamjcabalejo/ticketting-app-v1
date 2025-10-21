import fs from 'fs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

/**
 * Sends a registration confirmation email with QR code using Resend
 */
export async function sendRegistrationEmail(data: EmailData): Promise<EmailResult> {
  try {
    
    // Extract base64 content from data URL
    const base64Content = data.qrCode.replace('data:image/png;base64,', '');
    
    // Generate HTML email template with CID reference
    const htmlEmail = generateHTMLEmailTemplateWithCID(data);
    
    const { data: resendData, error } = await resend.emails.send({
      from: "Event Registration <developers@dstsolutions.dev>",
      to: [data.email],
      subject: "Event Registration Confirmation",
      html: htmlEmail,
      attachments: [
        {
          content: base64Content,
          filename: 'qr-code.png',
          contentId: 'qr-code-image'
        }
      ]
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: resendData?.id,
    };
  } catch (error) {
    console.error('Failed to send registration email:', error);
    return {
      success: false,
      error: 'Network error while sending email',
    };
  }
}

function generateHTMLEmailTemplateWithCID(data: EmailData): string {
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
          Dear ${data.firstName} ${data.lastName},
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
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
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
