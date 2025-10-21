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
    <div className="space-y-4 sm:space-y-6">
      {/* Scanner title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Scan QR Code</h2>
        <p className="text-white/70 text-sm sm:text-base px-2">
          Point your camera at a QR code to scan it
        </p>
      </div>
      
      {/* Scanner container */}
      <div className="flex justify-center w-full">
        <div className="backdrop-blur-sm bg-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 overflow-hidden w-full max-w-xs sm:max-w-sm">
          <div className="relative w-full flex justify-center">
            <Scanner
              onScan={handleScan}
              components={{
                tracker: highlightCodeOnCanvas,
              }}
              styles={{
                container: { 
                  width: '100%', 
                  maxWidth: '280px',
                  height: '210px', 
                  borderRadius: '8px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                },
                video: { 
                  width: '100%', 
                  maxWidth: '280px',
                  height: '210px', 
                  borderRadius: '8px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Scanned data display */}
      {scannedValue && (
        <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-1 sm:mb-2">✓ Scan Successful!</h3>
            <p className="text-white/70 text-sm sm:text-base">QR code data extracted</p>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {scannedValue.firstName && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/10 gap-1 sm:gap-0">
                <span className="font-medium text-white/90 text-sm sm:text-base">First Name:</span>
                <span className="text-white font-semibold text-sm sm:text-base">{scannedValue.firstName}</span>
              </div>
            )}
            {scannedValue.lastName && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/10 gap-1 sm:gap-0">
                <span className="font-medium text-white/90 text-sm sm:text-base">Last Name:</span>
                <span className="text-white font-semibold text-sm sm:text-base">{scannedValue.lastName}</span>
              </div>
            )}
            {scannedValue.email && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/10 gap-1 sm:gap-0">
                <span className="font-medium text-white/90 text-sm sm:text-base">Email:</span>
                <span className="text-white font-semibold text-sm sm:text-base break-all">{scannedValue.email}</span>
              </div>
            )}
            {scannedValue.phone && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/10 gap-1 sm:gap-0">
                <span className="font-medium text-white/90 text-sm sm:text-base">Phone:</span>
                <span className="text-white font-semibold text-sm sm:text-base">{scannedValue.phone}</span>
              </div>
            )}
            {scannedValue.rawValue && (
              <div className="py-2 border-b border-white/10">
                <span className="font-medium text-white/90 block mb-1 text-sm sm:text-base">Raw Value:</span>
                <span className="text-white font-mono text-xs sm:text-sm break-all bg-white/5 p-2 rounded">{scannedValue.rawValue}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1 sm:gap-0">
              <span className="font-medium text-white/90 text-sm sm:text-base">Scan Time:</span>
              <span className="text-white/80 text-xs sm:text-sm">{scannedValue.currentTime}</span>
            </div>
          </div>
          
          {/* Clear button */}
          <button 
            onClick={() => setScannedValue(null)}
            className="w-full mt-3 sm:mt-4 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            Scan Another Code
          </button>
        </div>
      )}
      
      {/* Instructions when no scan */}
      {!scannedValue && (
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <p className="text-white/60 text-xs sm:text-sm px-4">Position QR code within the camera view</p>
        </div>
      )}
    </div>
  );
}