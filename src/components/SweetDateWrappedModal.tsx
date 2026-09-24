import React from 'react';
import { Sparkles, X, Heart, Award, Calendar, DollarSign, Share2, Camera } from 'lucide-react';
import { DateItem, CoupleProfile } from '../types/date';
import { formatCurrency, calculateDaysTogether } from '../utils/formatters';
import { triggerRomanticConfetti } from '../utils/confetti';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface SweetDateWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dates: DateItem[];
  profile: CoupleProfile;
}

export const SweetDateWrappedModal: React.FC<SweetDateWrappedModalProps> = ({
  isOpen,
  onClose,
  dates,
  profile,
}) => {
  if (!isOpen) return null;

  const completed = dates.filter((d) => d.status === 'completed');
  const totalSpent = completed.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
  const daysTogether = calculateDaysTogether(profile.startDate) || 0;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  completed.forEach((d) => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  let topCategory = 'comida';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  // Highlighted date
  const bestDate = completed.find((d) => (d.memory?.rating || 0) >= 4) || completed[0];
  const highlightedPhoto = completed.find((d) => d.memory?.photoUrl || (d.memory?.photoUrls && d.memory.photoUrls.length > 0));
  const photoSrc = highlightedPhoto?.memory?.photoUrls?.[0] || highlightedPhoto?.memory?.photoUrl;

  const handleShare = () => {
    triggerRomanticConfetti();
    const text = `✨ ¡Nuestro Sweet Date Wrapped! 💕\n${profile.partner1} & ${profile.partner2}\n🌟 ${completed.length} citas increíbles completadas\n⏳ ${daysTogether} días juntos enamorándonos cada día\n🍽️ Categoría favorita: ${topCategory.toUpperCase()}\n¡Por muchos planes más juntos!`;
    if (navigator.share) {
      navigator.share({ title: 'Sweet Date Wrapped', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('¡Resumen copiado al portapapeles para compartir con tu amor!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090e1f] border-2 border-[#b892ff]/50 shadow-2xl p-6 text-slate-100 my-8 overflow-hidden">
        {/* Solid lilac top strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#b892ff]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Chicks */}
        <div className="text-center pt-2 mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <SleepingChicksLogo className="w-10 h-8" />
            <h2 className="text-2xl font-bold font-lettering text-[#a2dbfc]">
              Sweet Date Wrapped
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            La historia de amor de <strong className="text-white">{profile.partner1}</strong> & <strong className="text-white">{profile.partner2}</strong>
          </p>
        </div>

        {/* Card of Memories */}
        <div className="space-y-3 mb-5">
          {/* Days Together & Dates Count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 text-center">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-white">{daysTogether}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Días Juntos</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 text-center">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-white">{completed.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Citas Hechas</div>
            </div>
          </div>

          {/* Investment & Top Category */}
          <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Invertido en Felicidad
              </span>
              <span className="text-lg font-black text-emerald-400">
                {formatCurrency(totalSpent, profile.currency)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Plan Favorito
              </span>
              <span className="text-sm font-bold text-[#b892ff] capitalize">
                {topCategory} ({maxCount} veces)
              </span>
            </div>
          </div>

          {/* Best Date Highlight */}
          {bestDate && (
            <div className="p-4 rounded-2xl bg-[#131128] border border-purple-800/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Cita Más Destacada</span>
              </div>
              <div className="text-sm font-bold text-white mb-0.5">
                {bestDate.title}
              </div>
              {bestDate.memory?.note && (
                <p className="text-xs text-purple-200 italic font-script">
                  "{bestDate.memory.note}"
                </p>
              )}
            </div>
          )}

          {/* Photo Highlight */}
          {photoSrc && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-36 bg-black">
              <img
                src={photoSrc}
                alt="Foto destacada"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-2 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] text-white font-semibold flex items-center gap-1">
                <Camera className="w-3 h-3 text-[#a2dbfc]" />
                <span>Foto de Recuerdo Favorita</span>
              </div>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-2xl bg-[#a2dbfc] text-[#061428] font-black text-xs hover:bg-[#8ecff9] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#a2dbfc]/20 cursor-pointer active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir Nuestro Wrapped 💕</span>
        </button>
      </div>
    </div>
  );
};
