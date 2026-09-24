import React from 'react';
import { X, Heart } from 'lucide-react';

interface PhotoLightboxProps {
  photo: { url: string; title: string } | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-[#0e172e] p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden max-h-[80vh]">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto max-h-[72vh] object-contain rounded-xl"
          />
        </div>

        <div className="mt-3 text-center">
          <p className="text-white text-sm font-semibold flex items-center justify-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>{photo.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
