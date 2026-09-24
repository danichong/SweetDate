import React, { useState } from 'react';
import { MapPin, Heart, X, Sparkles, Navigation, Calendar, Camera } from 'lucide-react';
import { DateItem } from '../types/date';
import { formatDateLabel } from '../utils/formatters';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface MemoriesMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  dates: DateItem[];
  onViewPhoto: (photoUrl: string, title: string) => void;
}

export const MemoriesMapModal: React.FC<MemoriesMapModalProps> = ({
  isOpen,
  onClose,
  dates,
  onViewPhoto,
}) => {
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);

  if (!isOpen) return null;

  // Filter dates that have a location and are completed
  const mapDates = dates.filter((d) => d.status === 'completed' && d.location && d.location.trim().length > 0);

  // Position coordinates generator for mock visual pins based on hash
  const getCoordinates = (title: string, index: number) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i);
      hash |= 0;
    }
    const x = 18 + ((Math.abs(hash) % 65) + (index * 7) % 60) % 68;
    const y = 20 + ((Math.abs(hash >> 3) % 55) + (index * 9) % 55) % 62;
    return { x, y };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0b1326] border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-sans">
                Nuestro Mapa del Amor
              </h2>
              <SleepingChicksLogo className="w-6 h-5" />
            </div>
            <p className="text-xs text-slate-400">
              Lugares y rincones especiales donde han compartido momentos inolvidables juntos.
            </p>
          </div>
        </div>

        {mapDates.length === 0 ? (
          <div className="py-16 text-center p-6 bg-[#080d1a] rounded-3xl border border-slate-800">
            <MapPin className="w-12 h-12 text-[#a2dbfc] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">
              Aún no hay ubicaciones en sus citas completadas
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Al agregar o editar una cita, escribe el lugar o dirección (ej. "Mirador de Chorrillos", "Parque Kennedy", etc.) para verlos pineados en su mapa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Interactive Visual Map Canvas */}
            <div className="lg:col-span-2 relative min-h-[380px] bg-[#070d1c] rounded-3xl border border-slate-800 p-4 overflow-hidden flex items-center justify-center">
              {/* Map grid lines & stylized terrain background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a2dbfc_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Decorative contours */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 150 50 300 120 T 600 80 T 900 150" fill="none" stroke="#a2dbfc" strokeWidth="2" />
                <path d="M 50 300 Q 200 250 400 320 T 750 260" fill="none" stroke="#b892ff" strokeWidth="2" />
                <circle cx="200" cy="180" r="140" fill="none" stroke="#a2dbfc" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="550" cy="240" r="180" fill="none" stroke="#b892ff" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* Heart Pins */}
              {mapDates.map((d, index) => {
                const { x, y } = getCoordinates(d.title, index);
                const isSelected = selectedDate?.id === d.id;

                return (
                  <div
                    key={d.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                    onClick={() => setSelectedDate(d)}
                  >
                    <div
                      className={`relative flex items-center justify-center transition-all ${
                        isSelected
                          ? 'scale-125 z-20'
                          : 'hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors border ${
                          isSelected
                            ? 'bg-[#b892ff] text-white border-white'
                            : 'bg-[#a2dbfc] text-[#061428] border-slate-900 group-hover:bg-[#b892ff] group-hover:text-white'
                        }`}
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </div>

                      {/* Ripple ping */}
                      <span className="absolute -inset-1 rounded-full bg-[#a2dbfc]/30 animate-ping pointer-events-none" />

                      {/* Tooltip */}
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.title}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 font-mono">
                {mapDates.length} {mapDates.length === 1 ? 'lugar registrado' : 'lugares registrados'} en su historia
              </div>
            </div>

            {/* Places List / Selected Place Details */}
            <div className="flex flex-col justify-between max-h-[380px] bg-[#0e172e] p-4 rounded-3xl border border-slate-800">
              <div className="mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {selectedDate ? 'Detalles del Lugar' : 'Lugares Visitados'}
                </h3>

                {selectedDate ? (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3 bg-[#080d1a] rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-[#a2dbfc] font-bold mb-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span className="truncate">{selectedDate.location}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {selectedDate.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mb-2">
                        {formatDateLabel(selectedDate.dateTime)}
                      </p>

                      {selectedDate.memory?.note && (
                        <p className="text-xs text-purple-200 italic font-script mb-2">
                          "{selectedDate.memory.note}"
                        </p>
                      )}

                      {/* Photo if available */}
                      {selectedDate.memory?.photoUrl && (
                        <button
                          type="button"
                          onClick={() => onViewPhoto(selectedDate.memory!.photoUrl!, selectedDate.title)}
                          className="w-full h-24 rounded-xl overflow-hidden border border-slate-700 block mb-2 cursor-pointer group"
                        >
                          <img
                            src={selectedDate.memory.photoUrl}
                            alt="Foto"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      )}

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDate.location || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#a2dbfc] hover:underline"
                      >
                        <span>Abrir en Google Maps</span>
                        <Navigation className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {mapDates.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedDate(item)}
                        className="p-2.5 rounded-xl bg-[#080d1a] hover:bg-[#121c35] border border-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          📍 {item.location}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Ver todos los lugares
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
