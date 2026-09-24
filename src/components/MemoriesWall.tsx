import React from 'react';
import { Camera, Heart, Calendar, Sparkles, Plus, Image as ImageIcon, MapPin, Images } from 'lucide-react';
import { DateItem } from '../types/date';
import { formatDateLabel } from '../utils/formatters';

interface MemoriesWallProps {
  completedDates: DateItem[];
  onOpenMemory: (item: DateItem) => void;
  onViewPhoto: (photoUrl: string, title: string) => void;
  onOpenNewDate: () => void;
  onOpenMap: () => void;
}

export const MemoriesWall: React.FC<MemoriesWallProps> = ({
  completedDates,
  onOpenMemory,
  onViewPhoto,
  onOpenNewDate,
  onOpenMap,
}) => {
  const datesWithMemories = completedDates.filter((d) => d.memory?.photoUrl || (d.memory?.photoUrls && d.memory.photoUrls.length > 0) || d.memory?.note);

  if (completedDates.length === 0) {
    return (
      <div className="bg-[#0c1527] rounded-3xl p-8 sm:p-12 border border-slate-800 text-center shadow-lg text-slate-100">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Aún no tienen recuerdos guardados
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          A medida que completen sus citas y suban fotos o notas especiales, este muro se convertirá en su álbum de momentos inolvidables.
        </p>
        <button
          onClick={onOpenNewDate}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Planear nuestra primera cita</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-6 rounded-3xl bg-[#0c1527] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-100 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#a2dbfc] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#a2dbfc]" />
            <span>Álbum de Nuestro Amor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {completedDates.length} {completedDates.length === 1 ? 'Momento Especial Vivido' : 'Momentos Especiales Vividos'} 💕
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cada cita es una página dorada en su historia juntos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 text-xs font-bold text-[#a2dbfc] bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 border border-[#a2dbfc]/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Nuestro Mapa</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 bg-[#080d1a] px-3.5 py-2 rounded-xl border border-slate-800">
            <span>{datesWithMemories.length} con fotos</span>
          </div>
        </div>
      </div>

      {/* Polaroid / Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedDates.map((item, idx) => {
          const allPhotos: string[] = item.memory?.photoUrls && item.memory.photoUrls.length > 0
            ? item.memory.photoUrls
            : item.memory?.photoUrl
            ? [item.memory.photoUrl]
            : [];
          const mainPhoto = allPhotos[0];
          const rotationAngle = (idx % 3 === 0 ? -1.5 : idx % 3 === 1 ? 1.5 : 0);

          return (
            <div
              key={item.id}
              style={{ transform: `rotate(${rotationAngle}deg)` }}
              className="group bg-[#0e172e] p-4 pb-5 rounded-2xl shadow-md hover:shadow-2xl hover:rotate-0 transition-all duration-300 border border-slate-800 hover:border-purple-500/50 flex flex-col justify-between text-slate-100"
            >
              {/* Photo Frame (Polaroid Look) */}
              <div className="relative aspect-4/3 w-full bg-[#080e1c] rounded-xl overflow-hidden mb-3 border border-slate-800">
                {mainPhoto ? (
                  <>
                    <img
                      src={mainPhoto}
                      alt={item.title}
                      onClick={() => onViewPhoto(mainPhoto, item.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                    {allPhotos.length > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] text-[#a2dbfc] font-bold flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        <span>{allPhotos.length} fotos</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    onClick={() => onOpenMemory(item)}
                    className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-[#121d38] transition-colors cursor-pointer p-4 text-center"
                  >
                    <Camera className="w-8 h-8 mb-2 text-purple-400" />
                    <span className="text-xs font-medium">
                      Toca para añadir fotos de esta cita
                    </span>
                  </div>
                )}

                {/* Rating Badge */}
                {item.memory?.rating && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs shadow-md border border-white/10 flex items-center gap-0.5">
                    {Array.from({ length: item.memory.rating }).map((_, i) => (
                      <span key={i} className="text-xs">❤️</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Polaroid Note Content */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    <span>{formatDateLabel(item.dateTime)}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h4>
                </div>

                {item.memory?.note ? (
                  <p className="font-script text-base text-purple-200 bg-[#131126] p-2.5 rounded-xl border border-purple-800/60 italic leading-snug">
                    "{item.memory.note}"
                  </p>
                ) : (
                  <button
                    onClick={() => onOpenMemory(item)}
                    className="text-left text-xs text-sky-400 hover:text-sky-300 font-semibold italic underline underline-offset-2 py-1 cursor-pointer"
                  >
                    + Escribir qué sintieron ese día...
                  </button>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                    {item.location || 'Lugar especial'}
                  </span>
                  <button
                    onClick={() => onOpenMemory(item)}
                    className="text-purple-300 hover:text-purple-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{allPhotos.length > 0 ? 'Editar fotos' : 'Subir'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
