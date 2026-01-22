
import React, { useRef, useEffect, useState } from 'react';
import { Camera as CameraIcon, RotateCw, X } from 'lucide-react';

interface CameraProps {
  onCapture: (imageData: string) => void;
}

const CameraComponent: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add Timestamp Overlay (requirement)
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.fillText(new Date().toLocaleString(), 20, canvas.height - 40);
        context.fillText("Loc: -7.2504, 112.7688 (Surabaya)", 20, canvas.height - 70);

        const data = canvas.toDataURL('image/jpeg');
        onCapture(data);
      }
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-6">
        <button 
          onClick={takePhoto}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-xl active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-full" />
        </button>
      </div>
      
      <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full">
         <RotateCw size={16} />
      </div>
    </div>
  );
};

export default CameraComponent;
