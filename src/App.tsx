import React, { useState } from 'react';
import { Camera } from './components/Camera2';
import { Camera as CameraIcon, ArrowLeft } from 'lucide-react';
import { FingerType, UploadResponse, FingerprintDetail } from './types';
import { uploadFingerprint, getFingerprintDetails } from './services/api';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { ClientRegistration } from './components/ClientRegistration';

function App() {
  const [clientId, setClientId] = useState<number | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<FingerType>('index');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [processedFingerprint, setProcessedFingerprint] = useState<FingerprintDetail | null>(null);

  const fingers: FingerType[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!capturedImage || !clientId) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const response = await uploadFingerprint({
        client_id: clientId,
        finger_type: selectedFinger,
        finger_image: capturedImage
      });

      setMessage({ type: 'success', text: response.message });
      setCapturedImage(null);
      setShowProgress(true);

      setTimeout(async () => {
        try {
          const details = await getFingerprintDetails(
            response.data.client_id,
            response.data.finger_id
          );
          setProcessedFingerprint(details.data[0]);
        } catch (error) {
          setMessage({ type: 'error', text: 'Failed to fetch processed fingerprint.' });
        }
      }, 10000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload fingerprint. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProgressComplete = () => {
    setShowProgress(false);
    setMessage(null);
  };

  const handleNewClient = () => {
    setClientId(null);
    setProcessedFingerprint(null);
    setCapturedImage(null);
    setMessage(null);
    setShowProgress(false);
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <Header />
        <ClientRegistration onClientCreated={setClientId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Header />
          <button
            onClick={handleNewClient}
            className="flex items-center gap-2 text-black-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Client
          </button>
        </div>

        {!processedFingerprint ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Select Finger</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {fingers.map((finger) => (
                  <button
                    key={finger}
                    onClick={() => setSelectedFinger(finger)}
                    className={`px-4 py-2 rounded-full ${
                      selectedFinger === finger
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {finger.charAt(0).toUpperCase() + finger.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              {!capturedImage ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CameraIcon className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">Camera Preview</h2>
                  </div>
                  <Camera onCapture={handleCapture} />
                </>
              ) : (
                <div className="text-center">
                  <img
                    src={`data:image/jpeg;base64,${capturedImage}`}
                    alt="Captured fingerprint"
                    className="max-w-full rounded-lg shadow-lg mb-4"
                  />
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Processed Fingerprint</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Original Image</h3>
                <img
                  src={`data:image/jpeg;base64,${processedFingerprint.finger_image}`}
                  alt="Original fingerprint"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Processed Image</h3>
                <img
                  src={`data:image/jpeg;base64,${processedFingerprint.fingerprint}`}
                  alt="Processed fingerprint"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Captured on: {new Date(processedFingerprint.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => setProcessedFingerprint(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Capture New Fingerprint
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="relative">
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
            {showProgress && message.type === 'success' && (
              <ProgressBar duration={10000} onComplete={handleProgressComplete} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;