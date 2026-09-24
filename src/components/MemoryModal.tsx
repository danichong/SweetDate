import React, { useState, useEffect } from 'react';
import { X, Camera, Heart, Upload, Plus, Trash2 } from 'lucide-react';
import { DateItem } from '../types/date';
import { triggerRomanticConfetti } from '../utils/confetti';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateItem: DateItem | null;
  onSaveMemory: (dateId: string, memory: NonNullable<DateItem['memory']>, markCompleted: boolean) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  dateItem,
  onSaveMemory,
}) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [markCompleted, setMarkCompleted] = useState(true);

  useEffect(() => {
    if (dateItem) {
      const existingPhotos: string[] = dateItem.memory?.photoUrls && dateItem.memory.photoUrls.length > 0
        ? dateItem.memory.photoUrls
        : dateItem.memory?.photoUrl
        ? [dateItem.memory.photoUrl]
        : [];
      setPhotoUrls(existingPhotos);
      setNote(dateItem.memory?.note || '');
      setRating(dateItem.memory?.rating || 5);
      setMarkCompleted(dateItem.status === 'completed' || true);
    }
  }, [dateItem, isOpen]);

  if (!isOpen || !dateItem) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPhotoUrls((prev) => [...prev, reader.result as string].slice(0, 8)); // max 8 photos
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddUrl = () => {
    if (inputUrl.trim()) {
      setPhotoUrls((prev) => [...prev, inputUrl.trim()].slice(0, 8));
      setInputUrl('');
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerRomanticConfetti();
    onSaveMemory(
      dateItem.id,
      {
        photoUrl: photoUrls[0] || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        note: note.trim() || undefined,
        rating,
        completedAt: dateItem.memory?.completedAt || new Date().toISOString(),
      },
      markCompleted
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d162d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden text-slate-100 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1122]/95 border-b border-[#a2dbfc]/20 text-white flex items-center justify-between shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#a2dbfc]" />
            <h3 className="font-bold text-base text-white">Recuerdos y Fotos de la Cita</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <span className="text-xs text-[#a2dbfc] font-bold">Cita seleccionada:</span>
            <h4 className="text-base font-bold text-white mt-0.5">{dateItem.title}</h4>
          </div>

          {/* Multiple Photos upload / URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Galería de Fotos ({photoUrls.length}/8)
              </label>
              <span className="text-[11px] text-[#a2dbfc]">
                Puedes subir varias fotos
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Pega URL de imagen y presiona Enter..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="flex-1 px-3 py-2 text-xs bg-[#080e1c] border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#a2dbfc]/50 text-white placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <label className="px-3 py-2 bg-[#a2dbfc]/20 hover:bg-[#a2dbfc]/30 text-[#a2dbfc] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#a2dbfc]/40 transition-colors backdrop-blur-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Subir</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photos Preview Grid */}
            {photoUrls.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 bg-[#080e1c] rounded-2xl border border-slate-800">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#a2dbfc]/40 group">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/70 text-[8px] font-bold text-[#a2dbfc] rounded-md">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-400 bg-[#080e1c]/50">
                <Camera className="w-6 h-6 mx-auto mb-1 text-[#a2dbfc]" />
                <span>Sube una o varias fotos de su momento juntos para guardarlas en el muro</span>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ¿Qué fue lo más lindo de esta cita?
            </label>
            <textarea
              rows={3}
              placeholder="La comida estuvo deliciosa, nos reímos con... y prometimos volver."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-[#a2dbfc]/50 outline-none font-script text-base text-slate-200 placeholder-slate-500 resize-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Calificación de Amor
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                >
                  {star <= rating ? '❤️' : '🤍'}
                </button>
              ))}
              <span className="text-xs font-bold text-[#a2dbfc] ml-2">
                {rating} de 5 corazones
              </span>
            </div>
          </div>

          {/* Checkbox to mark as completed if not yet completed */}
          {dateItem.status === 'pending' && (
            <label className="flex items-center gap-2 pt-2 border-t border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
                className="w-4 h-4 text-[#a2dbfc] rounded-sm focus:ring-[#a2dbfc] bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-300">
                Marcar esta cita como <strong className="text-emerald-300">Completada</strong> automáticamente
              </span>
            </label>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-[#061428] stroke-[#061428]" />
              <span>Guardar Recuerdos</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
