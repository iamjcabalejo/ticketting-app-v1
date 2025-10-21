'use server';

import { z } from 'zod';
import { createRegistration } from '@/services/registration/data-access/mutations/create-registration';
import { getRegistrationByEmail } from '@/services/registration/data-access/queries/registration-queries';

// Registration form schema for server-side validation
const registrationFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export interface FormActionResult {
  success: boolean;
  message: string;
  qrCode?: string;
  registrationData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  errors?: Record<string, string[]>;
}

/**
 * Server action for handling registration form submission
 * This function validates the form data and calls the registration mutation
 */
export async function submitRegistrationForm(
  formData: FormData
): Promise<FormActionResult> {
  try {
    // Extract form data
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    // Validate form data
    const validationResult = registrationFormSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Please correct the errors below',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    // Check if registration already exists
    const existingRegistration = await getRegistrationByEmail(
      validationResult.data.email
    );

    if (existingRegistration.success && existingRegistration.data) {
      return {
        success: false,
        message: 'A registration with this email already exists. Please use a different email or contact support if you believe this is an error.',
      };
    }

    // Create registration using the mutation
    const result = await createRegistration(validationResult.data);

    if (result.success) {
      return {
        success: true,
        message: 'Registration successful! Your QR code has been generated and sent to your email.',
        qrCode: result.data?.qrCode,
        registrationData: validationResult.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Registration failed. Please try again.',
      };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
