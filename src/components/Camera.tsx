// import React, { useRef, useEffect } from 'react';

// interface CameraProps {
//   onCapture: (imageData: string) => void;
// }

// export function Camera({ onCapture }: CameraProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: 'environment' },
//           audio: false
//         });
        
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error('Error accessing camera:', err);
//       }
//     };

//     startCamera();

//     return () => {
//       const stream = videoRef.current?.srcObject as MediaStream;
//       stream?.getTracks().forEach(track => track.stop());
//     };
//   }, []);

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const context = canvasRef.current.getContext('2d');
//       if (context) {
//         canvasRef.current.width = videoRef.current.videoWidth;
//         canvasRef.current.height = videoRef.current.videoHeight;
//         context.drawImage(videoRef.current, 0, 0);
        
//         const imageData = canvasRef.current.toDataURL('image/jpeg');
//         onCapture(imageData.split(',')[1]); // Remove data URL prefix
//       }
//     }
//   };

//   return (
//     <div className="relative w-full max-w-md mx-auto">
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         className="w-full rounded-lg shadow-lg"
//       />
//       <canvas ref={canvasRef} className="hidden" />
//       <button
//         onClick={captureImage}
//         className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
//                  bg-blue-500 text-white px-6 py-2 rounded-full
//                  hover:bg-blue-600 transition-colors shadow-lg"
//       >
//         Capture
//       </button>
//     </div>
//   );
// }







import React, { useRef, useEffect, useState } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            advanced: [{ torch: false } as any]
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera access and refresh the page.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please ensure your device has a camera.');
          } else {
            setError('Error accessing camera. Please try again.');
          }
        }
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleTorch = async () => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    
    // Only proceed if torch is supported
    if (capabilities.torch) {
      try {
        const newTorchState = !torch;
        await track.applyConstraints({
          advanced: [{ torch: newTorchState } as any]
        });
        setTorch(newTorchState);
      } catch (err) {
        console.error('Error toggling torch:', err);
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData.split(',')[1]); // Remove data URL prefix
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={captureImage}
          className="bg-blue-500 text-white px-6 py-2 rounded-full
                   hover:bg-blue-600 transition-colors shadow-lg"
        >
          Capture
        </button>
      </div>
      <button
        onClick={toggleTorch}
        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all transform hover:scale-110
                   ${torch 
                     ? 'bg-yellow-400 text-yellow-900' 
                     : 'bg-gray-800 text-gray-300'}`}
        title="Toggle light"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      </button>
    </div>
  );
}