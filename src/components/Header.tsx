import React from 'react';
import { Fingerprint } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Fingerprint className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Fingerprint Capture
        </h1>
      </div>
      {/* <p className="text-gray-600">
        Select a finger and capture its print using your device's camera
      </p> */}
    </div>
  );
}