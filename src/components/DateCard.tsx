import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Shirt,
  Camera,
  Heart,
  CalendarPlus,
  CloudSun,
  Images,
} from 'lucide-react';
import { DateItem, DateWeather } from '../types/date';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency, formatDateLabel, getRelativeTimeTag } from '../utils/formatters';
import { triggerRomanticConfetti } from '../utils/confetti';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { fetchWeatherForLocation } from '../utils/weather';

interface DateCardProps {
  dateItem: DateItem;
  currency: string;
  onToggleStatus: (id: string) => void;
  onEdit: (item: DateItem) => void;
  onDelete: (id: string) => void;
  onOpenMemory: (item: DateItem) => void;
  onViewPhoto: (photoUrl: string, title: string) => void;
}

export const DateCard: React.FC<DateCardProps> = ({
  dateItem,
  currency,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenMemory,
  onViewPhoto,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [weather, setWeather] = useState<DateWeather | null>(dateItem.weather || null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const category = CATEGORIES[dateItem.category] || CATEGORIES.comida;
  const isCompleted = dateItem.status === 'completed';
  const relativeTime = getRelativeTimeTag(dateItem.dateTime);

  // Auto-fetch weather for outdoor/adventure or upcoming dates if location is provided
  useEffect(() => {
    if (!weather && dateItem.location && (dateItem.category === 'aire_libre' || dateItem.category === 'aventura' || relativeTime.isToday)) {
      setLoadingWeather(true);
      fetchWeatherForLocation(dateItem.location)
        .then((data) => {
          if (data) setWeather(data);
        })
        .finally(() => setLoadingWeather(false));
    }
  }, [dateItem.location, dateItem.category, relativeTime.isToday]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      triggerRomanticConfetti();
    }
    onToggleStatus(dateItem.id);
  };

  // Photos array
  const allPhotos: string[] = dateItem.memory?.photoUrls && dateItem.memory.photoUrls.length > 0
    ? dateItem.memory.photoUrls
    : dateItem.memory?.photoUrl
    ? [dateItem.memory.photoUrl]
    : [];

  return (
    <article
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md shadow-black/30 ${
        isCompleted
          ? 'border-[#b892ff]/40 bg-[#0e172e] opacity-95'
          : 'bg-[#0e172e] border-slate-800/90 hover:border-[#b892ff]/60 hover:shadow-xl hover:shadow-black/40'
      }`}
    >
      {/* Top Bar Accent Strip in solid lilac (no difuminado / sin degradado) */}
      <div className="h-1.5 w-full bg-[#b892ff]" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Category & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Category & Status tag */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-[#b892ff]">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-sky-300 font-bold">
              {formatCurrency(dateItem.budget, currency)}
            </span>
          </div>

          {/* Quick Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Opciones"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-48 bg-[#0c1527] rounded-xl shadow-2xl border border-slate-700 py-1.5 text-xs font-medium text-slate-200 animate-in fade-in zoom-in-95">
                  <a
                    href={getGoogleCalendarUrl(dateItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2 cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Añadir a Google Calendar</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      downloadIcsFile(dateItem);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Descargar iCal (.ics)</span>
                  </button>
                  <div className="h-px bg-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(dateItem);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    <span>Editar plan</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenMemory(dateItem);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-purple-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isCompleted ? 'Editar recuerdos' : 'Agregar recuerdo'}</span>
                  </button>
                  <div className="h-px bg-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm(`¿Eliminar el plan "${dateItem.title}"?`)) {
                        onDelete(dateItem.id);
                      }
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-950/60 text-rose-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title & Completed Badge (No strikethrough for crystal clear readability) */}
        <div className="flex items-start gap-2 mb-2 flex-wrap">
          <h3
            className={`text-base sm:text-lg font-bold leading-snug flex-1 ${
              isCompleted
                ? 'text-slate-200'
                : 'text-white group-hover:text-sky-200 transition-colors'
            }`}
          >
            {dateItem.title}
          </h3>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-md shrink-0">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Completada ✓
            </span>
          )}
        </div>

        {/* Date, Time & Relative label */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{formatDateLabel(dateItem.dateTime)}</span>
          </div>

          {relativeTime.text && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md text-[11px] border ${
                  relativeTime.isToday
                    ? 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40'
                    : relativeTime.isPast
                    ? 'text-slate-400 bg-slate-800/60 border-slate-700/60'
                    : 'text-purple-300 bg-purple-950/70 border-purple-500/40'
                }`}
              >
                {relativeTime.text}
              </span>
            </>
          )}

          {/* Quick Calendar export button */}
          <a
            href={getGoogleCalendarUrl(dateItem)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-sky-300/80 hover:text-sky-200 hover:underline cursor-pointer ml-auto"
            title="Agendar en Google Calendar"
          >
            <CalendarPlus className="w-3 h-3" />
            <span>Agendar</span>
          </a>
        </div>

        {/* Weather Forecast Badge for outdoor/adventure dates */}
        {weather && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-sky-900/40 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{weather.icon}</span>
              <span className="font-semibold text-sky-200">{weather.temp}°C</span>
              <span className="text-slate-400">· {weather.condition}</span>
            </div>
            {weather.advisory && (
              <span className="text-[10px] text-slate-400 truncate max-w-[170px] italic">
                {weather.advisory}
              </span>
            )}
          </div>
        )}

        {/* Location & Dress Code (Location opens directly in Google Maps) */}
        {(dateItem.location || dateItem.dressCode || dateItem.externalLink) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3 pt-2.5 border-t border-slate-800/80">
            {dateItem.location && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dateItem.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-300 hover:text-sky-300 hover:underline truncate max-w-[200px] transition-colors"
                title={`Ver "${dateItem.location}" en Google Maps`}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{dateItem.location}</span>
              </a>
            )}

            {dateItem.dressCode && (
              <span className="flex items-center gap-1 text-slate-300 truncate max-w-[180px]" title={dateItem.dressCode}>
                <Shirt className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{dateItem.dressCode}</span>
              </span>
            )}

            {dateItem.externalLink && (
              <a
                href={dateItem.externalLink.startsWith('http') ? dateItem.externalLink : `https://${dateItem.externalLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline"
                title="Abrir enlace de la cita"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Enlace</span>
              </a>
            )}
          </div>
        )}

        {/* Notes */}
        {dateItem.notes && (
          <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-2 mb-4 bg-[#080e1c] p-2.5 rounded-xl border border-slate-800/90">
            {dateItem.notes}
          </p>
        )}

        {/* Memory Box if Completed with photo gallery or note */}
        {isCompleted && dateItem.memory && (
          <div className="mt-auto pt-3 border-t border-purple-900/60">
            <div className="flex items-start gap-3 bg-[#131126] p-2.5 rounded-xl border border-purple-800/50">
              {allPhotos.length > 0 ? (
                <div className="relative shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => onViewPhoto(allPhotos[0], dateItem.title)}
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-purple-500/50 shadow-md group/photo cursor-pointer"
                  >
                    <img
                      src={allPhotos[0]}
                      alt="Recuerdo"
                      className="w-full h-full object-cover transition-transform group-hover/photo:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                  {allPhotos.length > 1 && (
                    <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#a2dbfc] text-[#061428] font-black text-[9px] shadow-sm flex items-center gap-0.5">
                      <Images className="w-2.5 h-2.5" />
                      +{allPhotos.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenMemory(dateItem)}
                  className="shrink-0 w-14 h-14 rounded-lg border border-dashed border-purple-400/60 flex flex-col items-center justify-center text-purple-300 hover:bg-purple-950/80 transition-colors cursor-pointer"
                  title="Subir fotos del recuerdo"
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Foto</span>
                </button>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    Recuerdo
                  </span>
                  {dateItem.memory.rating && (
                    <div className="flex items-center gap-0.5 text-rose-400 text-xs">
                      {Array.from({ length: dateItem.memory.rating }).map((_, i) => (
                        <span key={i}>❤️</span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-purple-200 italic line-clamp-2 leading-relaxed font-script">
                  "{dateItem.memory.note || '¡Un momento inolvidable juntos!'}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Quick Complete button & Action with baby blue */}
      <div className="px-5 py-3 bg-[#0a1122]/90 border-t border-slate-800/80 flex items-center justify-between backdrop-blur-xs">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-xs ${
            isCompleted
              ? 'text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40'
              : 'text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 shadow-sm shadow-[#a2dbfc]/15 font-black'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-950" />
              <span>¡Completada!</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-[#061428] stroke-[2.5]" />
              <span>Marcar como hecha</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenMemory(dateItem)}
            className="p-1.5 text-slate-400 hover:text-[#a2dbfc] hover:bg-[#a2dbfc]/10 rounded-lg transition-colors cursor-pointer"
            title={isCompleted ? 'Ver / Editar recuerdos' : 'Añadir fotos y nota del recuerdo'}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(dateItem)}
            className="p-1.5 text-slate-400 hover:text-[#a2dbfc] hover:bg-[#a2dbfc]/10 rounded-lg transition-colors cursor-pointer"
            title="Editar detalles"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
