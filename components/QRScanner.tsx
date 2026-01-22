
import React, { useEffect, useRef } from 'react';

interface Props {
  onResult: (data: string) => void;
}

const QRScanner: React.FC<Props> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera error", e);
      }
    }
    start();

    // Auto-resolve simulation for demo purposes
    const timer = setTimeout(() => {
      onResult("MOCK-QR-DATA-123");
    }, 4000);

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      clearTimeout(timer);
    };
  }, [onResult]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-3xl" />
      <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none">
        <div className="w-full h-full border-2 border-emerald-500 rounded-lg relative">
           <div className="absolute top-0 w-full h-1 bg-emerald-500/50 animate-bounce" />
        </div>
      </div>
      <p className="absolute bottom-10 bg-black/80 px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-widest">Scanning QR Code...</p>
    </div>
  );
};

export default QRScanner;
