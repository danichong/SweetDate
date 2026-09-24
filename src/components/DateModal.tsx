import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Shirt, Link as LinkIcon, DollarSign, Heart, Camera, Sparkles, Upload } from 'lucide-react';
import { DateCategory, DateItem } from '../types/date';
import { CATEGORY_LIST } from '../utils/categories';
import { triggerRomanticConfetti } from '../utils/confetti';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateData: Partial<DateItem>) => void;
  initialData?: DateItem | null;
  currency: string;
}

const INSPIRATION_IDEAS = [
  'Noche de Sushi & Juegos de Mesa',
  'Pícnic Romántico al Atardecer',
  'Cena Italiana a la Luz de las Velas',
  'Maratón de Cine con Mantas y Helado',
  'Paseo Nocturno para Ver las Luces',
  'Cata de Vinos y Quesos en Casa',
  'Taller de Pintura o Cerámica',
  'Día de Spa & Masajes Relajantes',
];

export const DateModal: React.FC<DateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DateCategory>('comida');
  const [dateTime, setDateTime] = useState('');
  const [budget, setBudget] = useState<number | string>(80);
  const [location, setLocation] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');

  // Memory fields
  const [photoUrl, setPhotoUrl] = useState('');
  const [memoryNote, setMemoryNote] = useState('');
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'comida');
      setDateTime(initialData.dateTime || '');
      setBudget(initialData.budget ?? 0);
      setLocation(initialData.location || '');
      setDressCode(initialData.dressCode || '');
      setExternalLink(initialData.externalLink || '');
      setNotes(initialData.notes || '');
      setStatus(initialData.status || 'pending');

      if (initialData.memory) {
        setPhotoUrl(initialData.memory.photoUrl || '');
        setMemoryNote(initialData.memory.note || '');
        setRating(initialData.memory.rating || 5);
      } else {
        setPhotoUrl('');
        setMemoryNote('');
        setRating(5);
      }
    } else {
      // Default new date: next Saturday 20:00
      const nextSat = new Date();
      nextSat.setDate(nextSat.getDate() + ((6 - nextSat.getDay() + 7) % 7 || 7));
      nextSat.setHours(20, 0, 0, 0);
      const isoLocal = nextSat.toISOString().slice(0, 16);

      setTitle('');
      setCategory('comida');
      setDateTime(isoLocal);
      setBudget(80);
      setLocation('');
      setDressCode('');
      setExternalLink('');
      setNotes('');
      setStatus('pending');
      setPhotoUrl('');
      setMemoryNote('');
      setRating(5);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Partial<DateItem> = {
      title: title.trim(),
      category,
      dateTime,
      budget: Number(budget) || 0,
      location: location.trim() || undefined,
      dressCode: dressCode.trim() || undefined,
      externalLink: externalLink.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
      memory:
        status === 'completed' || photoUrl || memoryNote
          ? {
              photoUrl: photoUrl.trim() || undefined,
              note: memoryNote.trim() || undefined,
              rating,
              completedAt: initialData?.memory?.completedAt || new Date().toISOString(),
            }
          : undefined,
    };

    if (status === 'completed' && initialData?.status !== 'completed') {
      triggerRomanticConfetti();
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0d162d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Header with clean navy & baby blue */}
        <div className="px-6 py-4 bg-[#0a1122]/95 border-b border-[#a2dbfc]/20 text-white flex items-center justify-between shrink-0 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#a2dbfc] text-[#a2dbfc]" />
            <h2 className="text-lg font-bold tracking-tight text-white">
              {initialData ? 'Editar Cita' : 'Planear Nueva Cita'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Título del Plan *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Noche de sushi & juegos, Pícnic al atardecer..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-[#a2dbfc]/50 focus:border-[#a2dbfc] outline-none transition-all font-medium text-white placeholder-slate-400"
            />

            {/* Quick Inspiration ideas */}
            {!initialData && (
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] text-[#a2dbfc] font-bold shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ideas:
                </span>
                {INSPIRATION_IDEAS.slice(0, 4).map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setTitle(idea)}
                    className="text-[11px] px-2 py-0.5 bg-[#a2dbfc]/10 border border-[#a2dbfc]/30 text-[#a2dbfc] hover:bg-[#a2dbfc]/20 rounded-lg whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_LIST.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#a2dbfc] bg-[#a2dbfc] text-[#061428] font-bold shadow-sm shadow-[#a2dbfc]/20'
                        : 'border-slate-800 bg-[#080e1c] text-slate-300 hover:bg-[#a2dbfc]/10 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.name.split('&')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date / Time & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Fecha y Hora Estimada
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Presupuesto ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Location & Dress code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Lugar o Destino
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ej. Miraflores, En nuestra sala..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Vestimenta / Dress Code
              </label>
              <div className="relative">
                <Shirt className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ej. Casual cómodo, Elegante..."
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Enlace de Referencia (Opcional)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Google Maps, Menú del restaurante, Entradas..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Detalles y Notas del Plan
            </label>
            <textarea
              rows={2}
              placeholder="Qué cosas llevar, sorpresas preparadas, platos favoritos a pedir..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-sky-400/50 outline-none text-white placeholder-slate-400"
            />
          </div>

          {/* Status Switcher */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Estado de la Cita
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  status === 'pending'
                    ? 'bg-[#a2dbfc]/25 text-[#a2dbfc] border-[#a2dbfc] ring-2 ring-[#a2dbfc]/30'
                    : 'bg-[#080e1c] text-slate-400 border-slate-800 hover:bg-[#121c38]'
                }`}
              >
                <span>🕒 Pendiente por Vivir</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'bg-[#a2dbfc]/25 text-[#a2dbfc] border-[#a2dbfc] ring-2 ring-[#a2dbfc]/30'
                    : 'bg-[#080e1c] text-slate-400 border-slate-800 hover:bg-[#121c38]'
                }`}
              >
                <span>✨ ¡Cita Realizada!</span>
              </button>
            </div>
          </div>

          {/* Memory Section if Completed */}
          {status === 'completed' && (
            <div className="bg-[#0b1428] p-4 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#a2dbfc] font-bold text-xs uppercase tracking-wider">
                <Camera className="w-4 h-4 text-[#a2dbfc]" />
                <span>Foto del Recuerdo & Nota Especial</span>
              </div>

              {/* Photo Input or Upload */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Foto de la Cita (Sube una foto o pega una URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="URL de imagen https://..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#080e1c] border border-slate-700 text-white rounded-xl outline-none focus:ring-2 focus:ring-[#a2dbfc]/50 placeholder-slate-500"
                  />
                  <label className="px-3 py-1.5 bg-[#a2dbfc]/20 hover:bg-[#a2dbfc]/30 text-[#a2dbfc] border border-[#a2dbfc]/40 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0 transition-colors backdrop-blur-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {photoUrl && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-[#a2dbfc]/40 shadow-md">
                    <img
                      src={photoUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-black cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Memory Note */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nota o recuerdo inolvidable
                </label>
                <textarea
                  rows={2}
                  placeholder="¡Lo que más nos gustó, la anécdota divertida o lo que sentimos ese día!"
                  value={memoryNote}
                  onChange={(e) => setMemoryNote(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#080e1c] border border-slate-700 text-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#a2dbfc]/50 font-script text-sm placeholder-slate-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Puntuación de Amor
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className="text-lg hover:scale-125 transition-transform cursor-pointer"
                    >
                      {stars <= rating ? '❤️' : '🤍'}
                    </button>
                  ))}
                  <span className="text-xs text-[#a2dbfc] font-semibold ml-2">
                    {rating} / 5 Corazones
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit / Cancel Buttons with baby blue */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-[#061428] stroke-[#061428]" />
              <span>{initialData ? 'Guardar Cambios' : 'Crear Cita'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
