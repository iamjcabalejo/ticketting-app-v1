"use client";

import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function QRScanner() {
  const [scannedValue, setScannedValue] = useState<any>(null);

  const highlightCodeOnCanvas = (detectedCodes: any, ctx: any) => {
    detectedCodes.forEach((detectedCode: any) => {
      const { boundingBox, cornerPoints } = detectedCode;

      // Draw bounding box
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 4;

      // Draw corner points
      ctx.fillStyle = '#FF0000';
      cornerPoints.forEach((point: { x: number; y: number }) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const parseQRData = (rawValue: string) => {
    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(rawValue);
      return jsonData;
    } catch {
      // If not JSON, try to parse as URL parameters or other formats
      // For now, return the raw value wrapped in an object
      return { rawValue };
    }
  };

  const formatScannedData = (data: any) => {
    const currentTime = new Date().toLocaleString();
    
    if (data.firstName || data.first_name) {
      return {
        firstName: data.firstName || data.first_name || '',
        lastName: data.lastName || data.last_name || '',
        email: data.email || '',
        phone: data.phone || data.phoneNumber || '',
        currentTime: currentTime
      };
    }
    
    // If it's just raw data, show it with current time
    return {
      rawValue: data.rawValue || data,
      currentTime: currentTime
    };
  };

  const handleScan = (result: any) => {
    console.log(result);
    if (result && result.length > 0) {
      const parsedData = parseQRData(result[0].rawValue);
      const formattedData = formatScannedData(parsedData);
      setScannedValue(formattedData);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Scanner
          onScan={handleScan}
          components={{
            tracker: highlightCodeOnCanvas,
          }}
          styles={{
            container: { width: '300px', height: '400px' },
            video: { width: '300px', height: '400px' },
          }}
        />
        {scannedValue && (
          <div className="mt-4 p-6 bg-gray-100 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Scanned Data:</h3>
            <div className="space-y-2">
              {scannedValue.firstName && (
                <div className="flex justify-between">
                  <span className="font-medium">First Name:</span>
                  <span className="text-gray-700">{scannedValue.firstName}</span>
                </div>
              )}
              {scannedValue.lastName && (
                <div className="flex justify-between">
                  <span className="font-medium">Last Name:</span>
                  <span className="text-gray-700">{scannedValue.lastName}</span>
                </div>
              )}
              {scannedValue.email && (
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-700">{scannedValue.email}</span>
                </div>
              )}
              {scannedValue.phone && (
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span className="text-gray-700">{scannedValue.phone}</span>
                </div>
              )}
              {scannedValue.rawValue && (
                <div className="flex justify-between">
                  <span className="font-medium">Raw Value:</span>
                  <span className="text-gray-700 break-all">{scannedValue.rawValue}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-3">
                <span className="font-medium">Current Time:</span>
                <span className="text-gray-700">{scannedValue.currentTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}