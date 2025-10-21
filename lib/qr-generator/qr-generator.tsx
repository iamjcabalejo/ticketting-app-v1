import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRCodeString, QRCodeData } from '@/lib/qr-generator/server-qr-generator';

/**
 * React component for displaying QR code on client-side
 */
export function QRCodeDisplay({ data, size = 200 }: { data: QRCodeData; size?: number }) {
  const qrString = generateQRCodeString(data);
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <QRCodeSVG 
        value={qrString} 
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
      />
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Scan this QR code at the event entrance
      </p>
    </div>
  );
}
