import QRCode from 'qrcode';

export interface QRCodeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Generates QR code data string for registration
 */
export function generateQRCodeString(data: QRCodeData): string {
  const qrData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    timestamp: new Date().toISOString(),
  };

  return JSON.stringify(qrData);
}

/**
 * Generates QR code as base64 data URL for server-side use (emails)
 */
export async function generateQRCodeDataURL(data: QRCodeData): Promise<string> {
  const qrString = generateQRCodeString(data);
  
  try {
    console.log('Generating QR code for data:', qrString);
    
    // Try with simpler options first
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'L'
    });
    
    console.log('QR code generated successfully');
    console.log('Data URL length:', qrCodeDataURL.length);
    console.log('Data URL starts with:', qrCodeDataURL.substring(0, 50));
    
    // Validate that it's a proper data URL
    if (!qrCodeDataURL.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid QR code data URL format');
    }
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    
    // Fallback: try with minimal options
    try {
      console.log('Trying fallback QR generation...');
      const fallbackQR = await QRCode.toDataURL(qrString);
      console.log('Fallback QR generated successfully');
      return fallbackQR;
    } catch (fallbackError) {
      console.error('Fallback QR generation also failed:', fallbackError);
      throw new Error('Failed to generate QR code');
    }
  }
}
