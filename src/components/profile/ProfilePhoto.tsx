import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface ProfilePhotoProps {
  currentUrl?: string | null;
  onUpdate: () => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ currentUrl, onUpdate }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Não foi possível acessar a câmera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!preview || !user) return;

    setUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(preview);
      const blob = await response.blob();
      
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Foto de perfil atualizada!');
      onUpdate();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error('Falha ao atualizar foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-ink-orange to-ink-magenta flex items-center justify-center overflow-hidden">
          {currentUrl ? (
            <img 
              src={currentUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={32} className="text-white" />
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-gray-800 text-ink-gold hover:bg-gray-700 transition-colors"
        >
          <Camera size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 rounded-lg p-6 max-w-lg w-full relative"
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  stopCamera();
                  setPreview(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-6">Atualizar Foto de Perfil</h2>

              <div className="space-y-6">
                {preview ? (
                  <div className="relative w-64 h-64 mx-auto">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-64 h-64 mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={startCamera}
                      className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-ink-gold transition-colors"
                    >
                      <Camera size={24} />
                      <span>Tirar Foto</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-ink-gold transition-colors"
                    >
                      <Upload size={24} />
                      <span>Upload</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  {isCameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-ink-gold text-ink-black rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Capturar
                    </button>
                  )}

                  {preview && (
                    <button
                      onClick={uploadPhoto}
                      disabled={uploading}
                      className="px-4 py-2 bg-gradient-to-r from-ink-orange to-ink-magenta text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {uploading ? 'Salvando...' : 'Salvar Foto'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePhoto;