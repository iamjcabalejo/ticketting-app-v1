import { db } from '@/data';
import { attendeeRegistrations, NewAttendeeRegistration } from '@/data/schema';
import { generateQRCodeDataURL } from '@/lib/qr-generator/server-qr-generator';
import { sendRegistrationEmail } from '@/lib/email-services/email-services';
import { randomUUID } from 'crypto';

export interface CreateRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateRegistrationResult {
  success: boolean;
  data?: {
    id: string;
    qrCode: string;
  };
  error?: string;
}

/**
 * Creates a new registration record in the database
 * This mutation handles the complete registration process including:
 * - Data validation
 * - Database insertion
 * - QR code generation
 * - Email notification with QR code
 */
export async function createRegistration(
  data: CreateRegistrationData
): Promise<CreateRegistrationResult> {
  try {
    // Generate QR code image for the registration
    const qrCodeImageURL = await generateQRCodeDataURL({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });

    // Prepare registration data for database insertion
    const registrationData: NewAttendeeRegistration = {
      id: randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      qrCode: qrCodeImageURL,
    };

    // Insert registration into database
    const [newAttendeeRegistration] = await db
    .insert(attendeeRegistrations)
      .values(registrationData)
      .returning({ id: attendeeRegistrations.id, qrCode: attendeeRegistrations.qrCode });

    // Send confirmation email with QR code
    const emailResult = await sendRegistrationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      qrCode: qrCodeImageURL,
    });

    // Log email result (don't fail registration if email fails)
    if (!emailResult.success) {
      console.warn('Email sending failed:', emailResult.error);
    }

    return {
      success: true,
      data: {
        id: newAttendeeRegistration.id,
        qrCode: newAttendeeRegistration.qrCode!,
      },
    };
  } catch (error) {
    console.error('Failed to create registration:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return {
          success: false,
          error: 'Email address is already registered',
        };
      }
      
      return {
        success: false,
        error: 'Failed to create registration. Please try again.',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
